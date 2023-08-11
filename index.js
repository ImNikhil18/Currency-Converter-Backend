const axios = require('axios');
// https://fixer.io/
const FIXER_API_KEY = '';
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

// https://restcountries.eu
const REST_COUNTRIES_API = `https://restcountries.com/v3.1/currency`;

// Async/Await

// First Async : Fetch data about currencies

const getExchangeRate = async ( fromCurrency, toCurrency ) =>{
    try {
        const response = await axios.get(FIXER_API);
        
        const rate = response.data.rates;
        const euro = 1 / rate[fromCurrency];
        const exchangeRate = euro * rate[toCurrency];
    
        return exchangeRate;
    } catch (error) {
        throw new Error(`unable to get currency ${fromCurrency} to ${toCurrency}`);
    }

};   

// getExchangeRate('USD', 'EUR');

// Second Async : Fetch data about countries

const getCountries = async (currencyCode) => {
    try {
      const response = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);
      
        // const val =  response.map(({country}) => country.name.common);
        const val = response.data;
        const finalRes =[];
        val.forEach(item => {
            // console.log(item.name.common);
            finalRes.push(item.name.common);
        });
        
        return finalRes;
    } catch (error) {
      throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
  };



// getCountries('USD');

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    try {
        const [countries, exchangeRate] = await Promise.all([
            getCountries(toCurrency),
            getExchangeRate(fromCurrency, toCurrency)
        ]);

        const convertedAmount = (amount * exchangeRate).toFixed(2);

        const countryNames = countries.join(', ');

        return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
        You can spend these in the following countries: ${countryNames}.`;
    } catch (error) {
        return `Error: ${error.message}`;
    }
};


// Third Async : Output data

async function main() {
    const result = await convertCurrency('INR', 'AUD', 2000);
    console.log(result);
}
// Call the main function to start the program
main();

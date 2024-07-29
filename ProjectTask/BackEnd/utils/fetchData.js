const axios = require('axios');

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

async function fetchData() {
  try {
    const response = await axios.get(THIRD_PARTY_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

module.exports = fetchData;

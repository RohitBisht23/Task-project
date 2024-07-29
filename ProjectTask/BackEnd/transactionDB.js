require('dotenv').config({ path: '.env' });
const connectDB = require('./db/connectDB');
const Transaction = require('./Models/transactions'); // Ensure correct import
const fetchData = require('./utils/fetchData');

const MONGO_URL = process.env.MONGO_URL;
console.log("URL -->", MONGO_URL);

const start = async () => {
  try {
    console.log('URL->', MONGO_URL); // Log the MongoDB URL
    const fetchedData = await fetchData();
    console.log(fetchedData);

    await connectDB(MONGO_URL);
    console.log(Transaction); // Log the Transaction model to ensure it's defined
    await Transaction.insertMany(fetchedData);
    console.log("Success");
  } catch (error) {
    console.log(error);
  }
};

start();

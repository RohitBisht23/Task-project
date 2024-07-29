const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./Routes/productRoutes');
const connectDB = require('./db/connectDB')

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());


app.use('/api/v1/products', productRoutes);

const start = async() =>{
  try {
    await connectDB(MONGO_URL);
    console.log("URL---->",MONGO_URL)
    app.listen(port, () =>{
      console.log(`Listening at port ${port}`);
    })
  } catch(error) {
    console.log(error);
  }
}

start();


import axios from 'axios';

const API_BASE_URL = 'http://localhost:4888/api/v1/products'; // Backend URL

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000, 
});

export default instance;
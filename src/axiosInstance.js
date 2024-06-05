import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend server's port
});

export default axiosInstance;

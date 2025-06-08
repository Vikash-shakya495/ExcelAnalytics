import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? `http://localhost:${import.meta.env.PORT || 5000}/api`
    : 'https://excel-analytics-backend-sigma.onrender.com/api',
  withCredentials: true,
});
export default api;

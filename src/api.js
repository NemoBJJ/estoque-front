import axios from 'axios';

const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isDevelopment
  ? 'http://localhost:8083/api'
  : 'https://estoque-container.neemindev.com/api';

console.log(`🚀 FrontEnd Estoque - BackEnd: ${BASE_URL}`);

const api = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: true,
});

export default api;
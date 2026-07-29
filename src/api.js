import axios from 'axios';

// FrontEnd Estoque - Contabo VPS
console.log('🚀 FrontEnd Estoque - Conectando ao BackEnd Contabo');

const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isDevelopment
  ? 'http://localhost:8083/api'
  : 'https://estoque-container.neemindev.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'admin',
    password: 'admin123'
  }
});

export default api;
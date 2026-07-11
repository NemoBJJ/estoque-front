import axios from 'axios';

// Forçando novo build do FrontEnd - 11/07/2026
console.log('🚀 FrontEnd Estoque - Conectando ao BackEnd Render');

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const BASE_URL = isDevelopment
  ? 'http://localhost:8083/api'
  : 'https://estoque-api-rfhv.onrender.com/api';

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
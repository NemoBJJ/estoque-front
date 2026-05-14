import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8083/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Adiciona autenticação básica
  auth: {
    username: 'admin',
    password: 'admin123'
  }
});

export default api;
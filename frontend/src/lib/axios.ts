import axios from 'axios';
import { useAuthStore } from '../store/auth';

// CACHE-BUSTER: Force clean build with live backend v2
const api = axios.create({
  baseURL: 'https://scanty-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

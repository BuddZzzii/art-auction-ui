import axios from 'axios';

// This is the "Base URL" - basically the phone number of the .NET backend.
// We'll change this to the actual URL once he gives it to us!
const API_BASE_URL = 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This "Interceptor" is like a stamp on an envelope.
// It automatically adds your VIP Token (the one we saved in login) to every request!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
import axios from 'axios';

// Create a central Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your C# port!
  headers: {
    'Content-Type': 'application/json'
  }
});

// ⚡ The Interceptor: Automatically attaches your token to every request
api.interceptors.request.use(
  (config) => {
    // Check local storage for the token (make sure 'token' matches the exact key your AuthContext uses to save it)
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
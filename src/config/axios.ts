import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:4000';

// Add a request interceptor to handle errors
axios.interceptors.request.use(
  (config) => {
    // You can add any request configuration here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;

import axios from 'axios';

// Configure axios defaults
// axios.defaults.baseURL = '/api';  // Removing this line

// Add a request interceptor to handle errors
axios.interceptors.request.use(
  (config) => {
    const requestInfo = {
      url: config.url,
      method: config.method,
      data: config.data,
      timestamp: new Date().toISOString(),
    };
    console.log('Making request:', requestInfo);
    localStorage.setItem('lastRequest', JSON.stringify(requestInfo));
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    localStorage.setItem(
      'lastRequestError',
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    );
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  (response) => {
    const responseInfo = {
      status: response.status,
      data: response.data,
      headers: response.headers,
      timestamp: new Date().toISOString(),
    };
    console.log('Response received:', responseInfo);
    localStorage.setItem('lastResponse', JSON.stringify(responseInfo));
    return response;
  },
  (error) => {
    const errorInfo = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
      timestamp: new Date().toISOString(),
    };
    console.error('Response error:', errorInfo);
    localStorage.setItem('lastResponseError', JSON.stringify(errorInfo));

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Log any persisted errors on load
const lastRequestError = localStorage.getItem('lastRequestError');
const lastResponseError = localStorage.getItem('lastResponseError');
if (lastRequestError) {
  console.error('Found persisted request error:', JSON.parse(lastRequestError));
  localStorage.removeItem('lastRequestError');
}
if (lastResponseError) {
  console.error(
    'Found persisted response error:',
    JSON.parse(lastResponseError)
  );
  localStorage.removeItem('lastResponseError');
}

export default axios;

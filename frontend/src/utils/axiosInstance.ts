import axios from 'axios';

// Create a reusable Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request Interceptor: Automatically attach JWT token to Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized responses globally
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    if (error.response?.status === 401) {
      // If token is invalid or expired, clear it and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error); // Still reject to handle in UI if needed
  }
);

export default axiosInstance;

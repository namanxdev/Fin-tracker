import axios from 'axios';
import toast from 'react-hot-toast';

// Base API URL based on environment
const getBaseUrl = () => {
  // In development, use the environment variable
  if (import.meta.env.MODE === 'development') {
    return import.meta.env.VITE_BASE_URL;
  }
  
  // In production:
  // If deployed to same domain (recommended), use relative URL
  // If deployed to different domain, use environment variable
  return import.meta.env.VITE_PROD_API_URL+'/api' || '/api';
};

const BASE_URL = getBaseUrl();

// Create axios instances with consistent configuration
const Incomeapi = axios.create({
    baseURL: `${BASE_URL}/incomes`,
    withCredentials: true, // For cookies/authorization headers
});

const Authapi = axios.create({
    baseURL: `${BASE_URL}/User`,
    withCredentials: true,
});

const Dashboardapi = axios.create({
    baseURL: `${BASE_URL}/financial`,
    withCredentials: true,
});

const Expenseapi = axios.create({
    baseURL: `${BASE_URL}/expenses`,
    withCredentials: true,
});

const Budgetapi = axios.create({
    baseURL: `${BASE_URL}/budgets`,
    withCredentials: true,
});

// Add response interceptors for authentication errors
[Incomeapi, Authapi, Dashboardapi, Expenseapi, Budgetapi].forEach(api => {
  api.interceptors.response.use(
    response => response,
    error => {
      // Handle authentication errors
      if (error.response?.status === 401 && window.location.pathname !== '/login') {
        toast.error('Authentication failed. Please log in again.');
        // Redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
});

// Centralized error handling function
const handleApiError = (error, defaultMessage, set) => {
    const message = error.response?.data?.message || defaultMessage;
    set({ isLoading: false, error: message });
    toast.error(message);
    throw error;
};

export {Incomeapi, Budgetapi, Expenseapi, Authapi, Dashboardapi, handleApiError};
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with credentials support
const api = axios.create({
    baseURL: 'http://localhost:3000/api/incomes',
    withCredentials: true, // Important for cookies to be sent
});

// Centralized error handling function
const handleApiError = (error, defaultMessage, set) => {
    const message = error.response?.data?.message || defaultMessage;
    console.error('Income API Error:', message); // TODO: delete this line
    set({ isLoading: false, error: message });
    toast.error(message);
    throw error;
};

export {api, handleApiError};
import { create } from 'zustand';
import axios from 'axios';

// Create axios instance with credentials support
const api = axios.create({
    baseURL: 'http://localhost:3000/api/User',
    withCredentials: true, // Important for cookies to be sent
});

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/login', { email, password });
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isLoading: false 
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({ 
                isAuthenticated: false, 
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },
    
    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/register', { email, password, name });
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isLoading: false 
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            set({ 
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },
    
    logout: async () => {
        try {
            await api.get('/logout'); // Changed to GET if your API uses GET for logout
            set({ user: null, isAuthenticated: false });
            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails on server, clear state on client
            set({ user: null, isAuthenticated: false });
            return { success: false, error: 'Logout failed' };
        }
    },
    
    // Check authentication status by calling the protected /profile endpoint
    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
        const response = await api.get('/profile');
        set({ 
            user: response.data, 
            isAuthenticated: true, 
            isLoading: false 
        });
        } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to authenticate";
        console.error("Auth check failed:", errorMessage);
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
        });
    }
  }
}));

export default useAuthStore;
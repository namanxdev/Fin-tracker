import { create } from 'zustand';
import axios from 'axios';

// Create axios instance with credentials support
const api = axios.create({
    baseURL: 'http://localhost:3000/api/User',
    withCredentials: true, // Important for cookies to be sent
});

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAuthLoading: true, // Add this line - start with loading state
    
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/login', { email, password });
            set({ 
                user: response.data, 
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
                user: response.data, 
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
        try {
            // Set loading to true at the start
            set({ isAuthLoading: true });
            
            const response = await api.get('/auth/check');
            if (response.data.authenticated) {
                set({ 
                    isAuthenticated: true,
                    user: response.data.user
                });
            } else {
                set({ isAuthenticated: false, user: null });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            set({ isAuthenticated: false, user: null });
        } finally {
            // Always set loading to false when done
            set({ isAuthLoading: false });
        }
    },

    // New methods for settings page
    updateProfile: async ({ name, email }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put('/profile', { name, email });
            set({ 
                user: response.data,
                isLoading: false 
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            set({ 
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },
    
    changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await api.put('/change-password', { currentPassword, newPassword });
            set({ isLoading: false });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            set({ 
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },
    
    // Add to authStore.js
    verifyPassword: async (password) => {
        set({ isLoading: true, error: null });
        try {
        const response = await api.post('/verify-password', { password });
        set({ isLoading: false });
        return { success: true };
        } catch (error) {
        const errorMessage = error.response?.data?.message || 'Password verification failed';
        set({ 
            isLoading: false,
            error: errorMessage
        });
        return { success: false, error: errorMessage };
        }
    },

    clearError: () => set({ error: null })
}));

export default useAuthStore;
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create API instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api/budgets',
    withCredentials: true,
});

// Error handler function
const handleApiError = (error, defaultMessage, set) => {
    const message = error.response?.data?.message || defaultMessage;
    console.error('Budget API Error:', message);
    set({ isLoading: false, error: message });
    toast.error(message);
    throw error;
};

const useBudgetStore = create((set, get) => ({
    budgets: [],
    budgetStatuses: [],
    currentBudget: null,
    isLoading: false,
    error: null,
    uiState: {
        view: 'overview', // 'overview', 'manage', 'create', 'edit'
        selectedPeriod: 'monthly',
        sortBy: 'category',
        sortDirection: 'asc',
    },
    
    // UI management functions
    clearError: () => set({ error: null }),
    
    updateUiState: (newState) => {
        set(state => ({
            uiState: { ...state.uiState, ...newState }
        }));
    },
    // Set current budget for editing (without API call)
    setCurrentBudget: (budget) => set({ currentBudget: budget }),

    // Clear current budget
    clearCurrentBudget: () => set({ currentBudget: null }),
    
    // CRUD operations
    getBudgets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/');
            const budgets = Array.isArray(response.data) ? response.data : [];
            set({ budgets, isLoading: false });
            return budgets;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch budgets', set);
        }
    },
    
    getBudgetStatuses: async () => {
        set({ isLoading: true, error: null });
        try {
            //http://localhost:3000/api/budgets/status/all
            const response = await api.get('/status/all');
            const statuses = Array.isArray(response.data) ? response.data : [];
            set({ budgetStatuses: statuses, isLoading: false });
            return statuses;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch budget statuses', set);
        }
    },
    
    getBudgetById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/${id}`);
            set({ currentBudget: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch budget details', set);
        }
    },
    
    createBudget: async (budgetData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/', budgetData);
            set(state => ({
                budgets: [...state.budgets, response.data],
                isLoading: false
            }));
            toast.success('Budget created successfully');
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to create budget', set);
        }
    },
    
    updateBudget: async (id, budgetData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/${id}`, budgetData);
            set(state => ({
                budgets: state.budgets.map(budget => 
                    budget._id === id ? response.data : budget
                ),
                isLoading: false
            }));
            toast.success('Budget updated successfully');
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to update budget', set);
        }
    },
    
    deleteBudget: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/${id}`);
            set(state => ({
                budgets: state.budgets.filter(budget => budget._id !== id),
                isLoading: false
            }));
            toast.success('Budget deleted successfully');
            return { success: true };
        } catch (error) {
            return handleApiError(error, 'Failed to delete budget', set);
        }
    },
    
    // Utility functions
    getBudgetStatus: (category) => {
        const { budgetStatuses } = get();
        return budgetStatuses.find(status => status.category === category);
    },
    
    getBudgetProgressPercentage: (category) => {
        const status = get().getBudgetStatus(category);
        if (!status) return 0;
        return Math.min((status.totalSpent / status.limit) * 100, 100);
    },
    
    getTotalBudgetedAmount: () => {
        const { budgets } = get();
        return budgets.reduce((total, budget) => total + budget.limit, 0);
    },
    
    getTotalSpentAmount: () => {
        const { budgetStatuses } = get();
        return budgetStatuses.reduce((total, status) => total + status.totalSpent, 0);
    }
}));

export default useBudgetStore;
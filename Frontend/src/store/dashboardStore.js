import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create API instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api/financial',
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

const useDashboardStore = create((set, get) => ({
    // State properties
    summaryData: null,
    cashFlowData: null,
    savingsData: null,
    budgetPerformance: null,
    isLoading: false,
    error: null,

    // Reset functions
    resetDashboard: () => set({
        summaryData: null,
        cashFlowData: null,
        savingsData: null,
        budgetPerformance: null,
        error: null
    }),

    // Get dashboard summary data
    getDashboardSummary: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/dashboard');
            set({ summaryData: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch dashboard summary', set);
        }
    },

    // Get cash flow analysis
    getCashFlow: async (months = 6) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/cash-flow?months=${months}`);
            set({ cashFlowData: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch cash flow data', set);
        }
    },

    // Get savings analysis
    getSavingsAnalysis: async (months = 12) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/savings?months=${months}`);
            set({ savingsData: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch savings analysis', set);
        }
    },

    // Get budget performance
    getBudgetPerformance: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/budget-performance');
            set({ budgetPerformance: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch budget performance', set);
        }
    },

    // Load all dashboard data at once
    loadDashboardData: async (options = { months: 6, savingsMonths: 12 }) => {
        try {
            set({ isLoading: true, error: null });
            await Promise.all([
                get().getDashboardSummary(),
                get().getCashFlow(options.months),
                get().getSavingsAnalysis(options.savingsMonths),
                get().getBudgetPerformance()
            ]);
            return true;
        } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to load some dashboard data');
            return false;
        }
    }
}));

export default useDashboardStore;
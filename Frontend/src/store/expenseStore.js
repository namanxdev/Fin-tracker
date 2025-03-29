import { create } from 'zustand';
import {Expenseapi as api} from '../Services/Api'

// Centralized error handling function
const handleApiError = (error, defaultMessage, set) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || defaultMessage;
    set({ isLoading: false, error: errorMessage });
    return { error: errorMessage };
};

const useExpenseStore = create((set, get) => ({
    expenses: [],
    currentExpense: null,
    isLoading: false,
    error: null,
    isNewUser: true,
    
    // UI state (safe to store in localStorage)
    uiState: {
        filters: {},
        sortBy: 'date',
        sortDirection: 'desc',
        viewMode: 'list',
        lastCategory: null,
    },
    
    // Clear any error message
    clearError: () => set({ error: null }),
    
    // Update UI preferences (safe to store)
    updateUiState: (newState) => {
        set(state => ({
            uiState: {
                ...state.uiState,
                ...newState
            }
        }));
        
        // Save UI preferences only (not expense data)
        try {
            const uiState = get().uiState;
            localStorage.setItem('financer-ui-prefs', JSON.stringify(uiState));
        } catch (e) {
            console.error('Failed to save UI preferences');
        }
    },
    
    // Load UI preferences
    loadUiPreferences: () => {
        try {
            const savedPrefs = localStorage.getItem('financer-ui-prefs');
            if (savedPrefs) {
                const prefs = JSON.parse(savedPrefs);
                set({ uiState: prefs });
            }
        } catch (e) {
            console.error('Failed to load UI preferences');
        }
    },

    // CRUD Operations
    getExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/');
            // Ensure we always have an array
            const expenses = Array.isArray(response.data) ? response.data : [];
            
            // Update isNewUser based on whether user has any expenses
            const isNewUser = expenses.length === 0;
            
            set({ 
                expenses,
                isLoading: false,
                isNewUser // Update new user status
            });
            return expenses;
        } catch (error) {
            // If API returns 404 or no data found, assume it's a new user
            if (error.response?.status === 404 || 
                error.response?.data?.message?.includes('no data')) {
                set({ expenses: [], isLoading: false, isNewUser: true });
                return [];
            }
            return handleApiError(error, 'Failed to fetch expenses', set);
        }
    },

    // Check if user is new
    checkNewUserStatus: async () => {
        // If we already have expenses loaded, check based on that
        if (get().expenses.length > 0) {
            set({ isNewUser: false });
            return false;
        }
        
        // Otherwise try to fetch expenses to determine status
        try {
            const expenses = await get().getExpenses();
            return expenses.length === 0;
        } catch (error) {
            console.error('Error checking new user status:', error);
            // Assume they're new if we can't determine status
            return true;
        }
    },

    createExpense: async (expenseData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/', expenseData);
            set((state) => ({
                expenses: [...state.expenses, response.data],
                isLoading: false,
                isNewUser: false // User has created an expense, so no longer new
            }));
            
            // Update last used category in UI state
            if (expenseData.category) {
                get().updateUiState({ lastCategory: expenseData.category });
            }
            
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to create expense', set);
        }
    },

    getExpenseById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/${id}`);
            set({ currentExpense: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch expense', set);
        }
    },

    updateExpense: async (id, expenseData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/${id}`, expenseData);
            set((state) => ({
                expenses: state.expenses.map((expense) =>
                    expense._id === id || expense.id === id ? response.data : expense
                ),
                currentExpense: response.data,
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to update expense', set);
        }
    },

    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(`/${id}`);
            set((state) => ({
                // Fix: Check both _id and id since MongoDB uses _id
                expenses: state.expenses.filter((expense) => 
                    expense._id !== id && expense.id !== id
                ),
                isLoading: false
            }));
            // Clear current expense if it was the deleted one
            const currentExp = get().currentExpense;
            if (currentExp && (currentExp.id === id || currentExp._id === id)) {
                set({ currentExpense: null });
            }
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to delete expense', set);
        }
    },
    
    // Summary Operations
    getCategorySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/categories');
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch category summary', set);
        }
    },

    getMonthlySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/monthly');
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch monthly summary', set);
        }
    },

    getYearlySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/yearly');
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch yearly summary', set);
        }
    },
    
    getMonthExpenses: async (year, month) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/summary/by-month/${year}/${month}`);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch monthly expenses', set);
        }
    },

    getDateRangeExpenses: async (startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/date-range', {
                params: { startDate, endDate }
            });
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch date range expenses', set);
        }
    },
    
    // Helper selectors to compute derived data
    selectors: {
        // Get total amount of all expenses
        getTotalExpenses: () => {
            const { expenses } = get();
            return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0).toFixed(2);
        },
        
        // Get top spending category
        getTopCategory: () => {
            const { expenses } = get();
            if (!expenses.length) return { name: 'None', amount: '0.00' };
            
            const categoryTotals = expenses.reduce((acc, exp) => {
                const category = exp.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + parseFloat(exp.amount || 0);
                return acc;
            }, {});
            
            const entries = Object.entries(categoryTotals);
            if (!entries.length) return { name: 'None', amount: '0.00' };
            
            const [name, amount] = entries.sort((a, b) => b[1] - a[1])[0];
            return { name, amount: amount.toFixed(2) };
        },
        
        // Get most recent expenses with optional limit
        getRecentExpenses: (limit = 5) => {
            const { expenses } = get();
            return [...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, limit);
        },
        
        // Get expenses filtered by category
        getExpensesByCategory: (category) => {
            const { expenses } = get();
            return expenses.filter(exp => exp.category === category);
        },
        
        // Get current month's expenses
        getCurrentMonthExpenses: () => {
            const { expenses } = get();
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            return expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return  expDate.getMonth() === currentMonth && 
                        expDate.getFullYear() === currentYear;
            });
        },
        
        // Get budget status (assuming budget is stored elsewhere)
        getBudgetStatus: (budget) => {
            const totalSpent = parseFloat(get().selectors.getTotalExpenses());
            if (!budget) return { used: 0, remaining: 0, percentage: 0 };
            
            const used = totalSpent;
            const remaining = budget - used;
            const percentage = Math.min(Math.round((used / budget) * 100), 100);
            
            return { used, remaining, percentage };
        }
    }
}));

// Initialize UI preferences when the store is first created
useExpenseStore.getState().loadUiPreferences();

export default useExpenseStore;
import { create } from "zustand";
import { api, handleApiError } from "../Services/IncomeApi";
import { format, subMonths } from 'date-fns';

// Zustand store for managing income data
const useIncomeStore = create((set, get) => ({
    incomes: [],
    currentIncome: null,
    isLoading: false,
    error: null,
    uiState: {
        filters: {},
        sortBy: 'date',
        sortDirection: 'desc',
        viewMode: 'list',
        lastCategory: null,
    },
    
    clearError: () => set({ error: null }),
    
    updateUiState: (newState) => {
        set(state => ({
            uiState: { ...state.uiState, ...newState }
        }));
        
        // Store in localStorage for persistence
        localStorage.setItem('income_ui_preferences', JSON.stringify({
            ...get().uiState,
            ...newState
        }));
    },
    
    loadUiPreferences: () => {
        try {
            const stored = localStorage.getItem('income_ui_preferences');
            if (stored) {
                const preferences = JSON.parse(stored);
                set(state => ({
                    uiState: { ...state.uiState, ...preferences }
                }));
            }
        } catch (error) {
            console.error('Failed to load UI preferences', error);
        }
    },

    getIncomes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/');
            // Ensure we always have an array
            const incomes = Array.isArray(response.data) ? response.data : [];
            set({ incomes, isLoading: false });
            return incomes;
        } catch (error) {
            set({ incomes: [], isLoading: false });
            return handleApiError(error, 'Failed to fetch incomes', set);
        }
    },

    createIncome: async (incomeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/', incomeData);
            set(state => ({
                incomes: [response.data, ...state.incomes],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to create income', set);
        }
    },

    getIncomeById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/${id}`);
            set({ currentIncome: response.data, isLoading: false });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch income details', set);
        }
    },

    updateIncome: async (id, incomeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/${id}`, incomeData);
            
            // Update the incomes list in the store
            set(state => ({
                incomes: state.incomes.map(income => 
                    income._id === id || income.id === id
                        ? response.data
                        : income
                ),
                isLoading: false
            }));
            
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to update income', set);
        }
    },

    deleteIncome: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/${id}`);
            set(state => ({
                incomes: state.incomes.filter(income => income._id !== id && income.id !== id),
                isLoading: false
            }));
            return { success: true };
        } catch (error) {
            return handleApiError(error, 'Failed to delete income', set);
        }
    },
    
    getCategorySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/categories');
            set({ isLoading: false });
            // Return proper format for pie chart
            return { categorySummary: Array.isArray(response.data) ? response.data : [] };
        } catch (error) {
            set({ isLoading: false });
            return { categorySummary: [] };
        }
    },
    
    getMonthlySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/monthly');
            set({ isLoading: false });
            // Return proper format for charts
            return { monthlyData: Array.isArray(response.data) ? response.data : [] };
        } catch (error) {
            set({ isLoading: false });
            return { monthlyData: [] };
        }
    },

    getYearlySummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/summary/yearly');
            set({ isLoading: false });
            // Return proper format for charts
            return { yearlyData: Array.isArray(response.data) ? response.data : [] };
        } catch (error) {
            set({ isLoading: false });
            return { yearlyData: [] };
        }
    },

    getLast12MonthsData: async () => {
        set({ isLoading: true, error: null });
        try {
            // First, get all incomes
            const allIncomes = await get().getIncomes();
            
            // Create template for last 12 months
            const today = new Date();
            const last12Months = Array.from({ length: 12 }, (_, i) => {
                const date = subMonths(today, i);
                return {
                    date: format(date, 'yyyy-MM'),
                    amount: 0,
                    month: format(date, 'MMM yyyy')
                };
            }).reverse();
            
            // Populate with actual income data
            if (allIncomes && allIncomes.length > 0) {
                // Map of yyyy-MM to total amount
                const monthlyTotals = {};
                
                // Calculate totals for each month
                allIncomes.forEach(income => {
                    const incomeDate = new Date(income.date);
                    const monthKey = format(incomeDate, 'yyyy-MM');
                    
                    if (!monthlyTotals[monthKey]) {
                        monthlyTotals[monthKey] = 0;
                    }
                    
                    monthlyTotals[monthKey] += parseFloat(income.amount || 0);
                });
                
                // Update the chart data with actual amounts
                last12Months.forEach(month => {
                    if (monthlyTotals[month.date]) {
                        month.amount = monthlyTotals[month.date];
                    }
                });
            }
            
            set({ isLoading: false });
            return { last12MonthsData: last12Months };
        } catch (error) {
            set({ isLoading: false });
            return { last12MonthsData: [] };
        }
    },

    selectors: {
        getTotalIncome: () => {
            const incomes = get().incomes;
            return incomes.reduce((total, income) => 
                total + parseFloat(income.amount || 0), 0)
                .toFixed(2);
        },
        
        getTopCategory: () => {
            const incomes = get().incomes;
            if (!incomes || incomes.length === 0) return null;
            
            const categorySums = {};
            
            incomes.forEach(income => {
                const category = income.category || 'Other';
                categorySums[category] = (categorySums[category] || 0) + parseFloat(income.amount || 0);
            });
            
            let topCategory = null;
            let maxAmount = 0;
            
            Object.entries(categorySums).forEach(([category, amount]) => {
                if (amount > maxAmount) {
                    topCategory = category;
                    maxAmount = amount;
                }
            });
            
            return { category: topCategory, amount: maxAmount };
        },
        
        getRecentIncomes: (limit = 5) => {
            const incomes = get().incomes;
            return [...incomes]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, limit);
        },
        
        getIncomesByCategory: (category) => {
            const incomes = get().incomes;
            return incomes.filter(income => income.category === category);
        },
        
        getCurrentMonthIncomes: () => {
            const incomes = get().incomes;
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            return incomes.filter(inc => {
                const incDate = new Date(inc.date);
                return incDate.getMonth() === currentMonth && 
                        incDate.getFullYear() === currentYear;
            });
        }
    }
}));

// Initialize UI preferences when the store is first created
useIncomeStore.getState().loadUiPreferences();

export default useIncomeStore;
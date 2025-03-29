import React, { useState } from 'react';
import { 
    Edit, 
    Trash, 
    AlertCircle, 
    X, 
    Calendar,
    DollarSign,
    Tag,
    AlertTriangle,
    RefreshCw 
} from 'lucide-react';
import useBudgetStore from '../../store/budgetStore';
import useThemeStore from '../../store/themeStore';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
    categoryIcons, 
    getCategoryColor, 
    getBudgetStatusColor,
    getBudgetStatusText,
    standardCategories
} from '../Theme/ThemeIcons';

function BudgetManage({ refreshTrigger, onBudgetUpdated }) {
    const isDark = useThemeStore(state => state.isDark());
    const { 
        budgets, 
        budgetStatuses, 
        uiState,
        getBudgetById,
        deleteBudget,
        updateBudget,
        currentBudget,
        setCurrentBudget,
        clearCurrentBudget
    } = useBudgetStore();
    
    // State for editing
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [editFormData, setEditFormData] = useState({
        category: '',
        limit: '',
        period: 'monthly',
        startDate: '',
        endDate: '',
        color: '',
        notes: ''
    });
    
    // Filter by selected period
    const filteredBudgets = budgets.filter(budget => 
        budget.period === uiState.selectedPeriod
    );
    
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-select color when category changes
        if (name === 'category') {
            setEditFormData(prev => ({ 
                ...prev, 
                [name]: value,
                color: getCategoryColor(value)
            }));
        } else {
            setEditFormData(prev => ({ 
                ...prev, 
                [name]: name === 'limit' ? parseFloat(value) || value : value 
            }));
        }
    };
    
    const handleEdit = async (id) => {
        try {
            const budget = await getBudgetById(id);
            // This already sets currentBudget in the store
            document.getElementById('edit_budget_modal').showModal();
        } catch (error) {
            toast.error("Failed to load budget details");
        }
    };
    
    const handleUpdateBudget = async (e) => {
        e.preventDefault();
        
        if (!currentBudget) {
            toast.error("No budget selected for editing");
            return;
        }
        
        try {
            const form = e.target;
            
            const startDate = form.startDate.value;
            const endDate = form.endDate.value || undefined;
            
            const budgetData = {
                category: form.category.value,
                limit: parseFloat(form.limit.value),
                period: form.period.value,
                startDate,
                endDate,
                description: form.notes.value  // Changed from notes to description
            };
            
            await updateBudget(currentBudget._id, budgetData);
            document.getElementById('edit_budget_modal').close();
            clearCurrentBudget();
            
            if (onBudgetUpdated) {
                onBudgetUpdated();
            }
        } catch (error) {
            toast.error(`Failed to update budget: ${error.message || 'Unknown error'}`);
        }
    };
    
    const promptDelete = (budget) => {
        setBudgetToDelete(budget);
        document.getElementById('delete_budget_modal').showModal();
    };

    const confirmDelete = async () => {
        if (!budgetToDelete) return;
        
        try {
            await deleteBudget(budgetToDelete._id);
            toast.success("Budget deleted successfully");
            if (onBudgetUpdated) onBudgetUpdated();
        } catch (error) {
            toast.error("Failed to delete budget");
        } finally {
            setBudgetToDelete(null);
            document.getElementById('delete_budget_modal').close();
        }
    };
    
    const getBudgetStatus = (category) => {
        return budgetStatuses.find(status => status.category === category);
    };
    
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (e) {
            return 'Invalid date';
        }
    };
    
    return (
        <>
            <div className={isDark ? 'text-white' : 'text-gray-800'}>
                <div className={`rounded-lg shadow-md overflow-hidden ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Budget Limit
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Period
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {filteredBudgets.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                                                <DollarSign size={32} className="mb-2 opacity-50" />
                                                <p>No budgets found for the selected period.</p>
                                                <p className="text-sm mt-1">Use the Create New Budget form to add one.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBudgets.map((budget) => {
                                        const status = getBudgetStatus(budget.category);
                                        const percentage = status 
                                            ? (status.totalSpent / budget.limit) * 100 
                                            : 0;
                                        
                                        const statusText = getBudgetStatusText(percentage);
                                        const icon = categoryIcons[budget.category];
                                        const categoryColor = getCategoryColor(budget.category);
                                        
                                        return (
                                            <tr key={budget._id} className={isDark 
                                                ? 'hover:bg-gray-700 transition-colors' 
                                                : 'hover:bg-gray-50 transition-colors'
                                            }>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span 
                                                            className="rounded-full p-1.5 mr-2" 
                                                            style={{ 
                                                                backgroundColor: categoryColor + '20', 
                                                                color: categoryColor 
                                                            }}
                                                        >
                                                            {icon}
                                                        </span>
                                                        <span className="font-medium">{budget.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    ${budget.limit.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                                    <span className="inline-flex items-center">
                                                        <Calendar size={14} className="mr-1.5 opacity-70" />
                                                        {budget.period}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDate(budget.startDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {status ? (
                                                        <div>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                percentage > 100 
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                                                                    : percentage > 80 
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                                {statusText}
                                                            </span>
                                                            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
                                                                <div 
                                                                    className={`h-1.5 rounded-full ${
                                                                        percentage > 100 
                                                                            ? 'bg-red-500' 
                                                                            : 'bg-gradient-to-r from-orange-500 to-purple-500'
                                                                    }`}
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                >
                                                                    <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-between text-xs mt-1 text-gray-500">
                                                                <span>${status.totalSpent.toLocaleString()}</span>
                                                                <span>{percentage.toFixed(0)}%</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="flex items-center text-gray-500">
                                                            <AlertCircle size={14} className="mr-1" />
                                                            No data
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(budget._id)}
                                                        className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-900 mr-1"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => promptDelete(budget)}
                                                        className="btn btn-sm btn-ghost text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Edit Budget Modal */}
            <dialog id="edit_budget_modal" className="modal">
                <div className={`modal-box ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    {currentBudget ? (
                        <form onSubmit={handleUpdateBudget}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-orange-500">Edit Budget</h3>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-ghost" 
                                    onClick={() => {
                                        document.getElementById('edit_budget_modal').close();
                                        clearCurrentBudget();
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>
                                            <Tag size={14} className="inline mr-1" /> Category
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            defaultValue={currentBudget.category}
                                            className={`select select-bordered w-full pl-10 ${
                                                isDark ? 'bg-gray-700 text-white' : ''
                                            }`}
                                            required
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {standardCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <span 
                                            className="absolute left-3 top-1/2 -translate-y-1/2" 
                                            style={{ color: getCategoryColor(currentBudget.category) }}
                                        >
                                            {categoryIcons[currentBudget.category]}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>
                                            <DollarSign size={14} className="inline mr-1" /> Budget Limit
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            name="limit"
                                            defaultValue={currentBudget.limit}
                                            className={`input input-bordered w-full pl-8 ${
                                                isDark ? 'bg-gray-700 text-white' : ''
                                            }`}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>
                                            <Calendar size={14} className="inline mr-1" /> Period
                                        </span>
                                    </label>
                                    <select
                                        name="period"
                                        defaultValue={currentBudget.period}
                                        className={`select select-bordered w-full ${
                                            isDark ? 'bg-gray-700 text-white' : ''
                                        }`}
                                        required
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>
                                            <Calendar size={14} className="inline mr-1" /> Start Date
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        defaultValue={currentBudget.startDate ? new Date(currentBudget.startDate).toISOString().split('T')[0] : ''}
                                        className={`input input-bordered w-full ${
                                            isDark ? 'bg-gray-700 text-white' : ''
                                        }`}
                                        required
                                    />
                                </div>
                            
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>
                                            <Calendar size={14} className="inline mr-1" /> End Date (Optional)
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        defaultValue={currentBudget.endDate ? new Date(currentBudget.endDate).toISOString().split('T')[0] : ''}
                                        className={`input input-bordered w-full ${
                                            isDark ? 'bg-gray-700 text-white' : ''
                                        }`}
                                        min={currentBudget.startDate ? new Date(currentBudget.startDate).toISOString().split('T')[0] : ''}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        
                                    </p>
                                </div>
                            </div>
                            
                            <div className="form-control mb-6">
                                <label className="label">
                                    <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Notes (Optional)</span>
                                </label>
                                <textarea
                                    name="notes"
                                    defaultValue={currentBudget.notes}
                                    className={`textarea textarea-bordered w-full ${
                                        isDark ? 'bg-gray-700 text-white' : ''
                                    }`}
                                    rows="3"
                                    placeholder="Add any additional details or reminders..."
                                ></textarea>
                            </div>
                            
                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => {
                                        document.getElementById('edit_budget_modal').close();
                                        clearCurrentBudget();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn bg-gradient-to-r from-orange-500 to-purple-500 border-none text-white hover:from-orange-600 hover:to-purple-600"
                                >
                                    Update Budget
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="py-12 text-center">
                            <RefreshCw size={40} className="mx-auto mb-4 animate-spin text-orange-500" />
                            <p>Loading budget data...</p>
                        </div>
                    )}
                </div>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_budget_modal" className="modal">
                <div className={`modal-box ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
                    {budgetToDelete && (
                        <>
                            <div className="flex items-center mb-4">
                                <AlertTriangle size={24} className="text-yellow-500 mr-2" />
                                <p>Are you sure you want to delete this budget?</p>
                            </div>
                            
                            <div className="flex items-center my-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                                <span 
                                    className="rounded-full p-1.5 mr-2" 
                                    style={{ 
                                        backgroundColor: getCategoryColor(budgetToDelete.category) + '20', 
                                        color: getCategoryColor(budgetToDelete.category) 
                                    }}
                                >
                                    {categoryIcons[budgetToDelete.category]}
                                </span>
                                <span className="font-medium">{budgetToDelete.category}</span>
                                <span className="ml-2 text-gray-500">
                                    (${budgetToDelete.limit.toLocaleString()})
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
                        </>
                    )}
                    <div className="modal-action">
                        <button 
                            type="button" 
                            className="btn btn-outline"
                            onClick={() => {
                                setBudgetToDelete(null);
                                document.getElementById('delete_budget_modal').close();
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                            onClick={confirmDelete}
                        >
                            Delete Budget
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default BudgetManage;
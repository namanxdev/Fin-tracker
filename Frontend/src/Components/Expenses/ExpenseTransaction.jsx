import React, { useEffect, useState, useMemo } from 'react';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';
import { format, parseISO } from 'date-fns';
import { 
    Pencil, 
    Trash2, 
    ArrowUp, 
    ArrowDown, 
    SortDesc, 
    Calendar,
    AlignJustify,
    X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function ExpenseTransaction({ refreshTrigger, onExpenseUpdated }) {
    const isDark = useThemeStore(state => state.isDark());
    const expenses = useExpenseStore(state => state.expenses);
    const getExpenses = useExpenseStore(state => state.getExpenses);
    const deleteExpense = useExpenseStore(state => state.deleteExpense);
    const updateExpense = useExpenseStore(state => state.updateExpense);
    const isLoading = useExpenseStore(state => state.isLoading);
    
    // State for editing
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
        description: ''
    });
    
    // Categories for dropdown
    const categories = [
        'Food', 'Transport', 'Entertainment', 'Utilities', 
        'Health', 'Travel', 'Other'
    ];
    
    // Add sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    
    // Fetch expenses when component mounts or refreshTrigger changes
    useEffect(() => {
        getExpenses();
    }, [getExpenses, refreshTrigger]);
    
    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    // Handle form field changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };
    
    // Handle edit button click
    const handleEdit = (id) => {
        const expense = expenses.find(exp => exp._id === id || exp.id === id);
        if (expense) {
            // Format date for input field (YYYY-MM-DD)
            const formattedDate = new Date(expense.date).toISOString().split('T')[0];
            
            setEditingExpenseId(id);
            setEditFormData({
                title: expense.title || '',
                amount: expense.amount || 0,
                category: expense.category || 'Other',
                date: formattedDate,
                description: expense.description || ''
            });
            
            // Open the modal
            document.getElementById('edit_expense_modal').showModal();
        } else {
            toast.error("Expense not found");
        }
    };
    
    // Handle form submission
    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        
        try {
            // Format the data properly before sending
            const formattedData = {
                ...editFormData,
                amount: parseFloat(editFormData.amount) // Ensure amount is a number
            };
            
            // Log for debugging
            console.log("Updating expense:", editingExpenseId, formattedData);
            
            // Call the update function
            await updateExpense(editingExpenseId, formattedData);
            toast.success("Expense updated successfully");
            
            // Close the modal
            document.getElementById('edit_expense_modal').close();
            
            // Reset form
            setEditingExpenseId(null);
            setEditFormData({
                title: '',
                amount: '',
                category: '',
                date: '',
                description: ''
            });
            
            // Force refresh expenses
            getExpenses();
            
            // Also trigger refresh callback
            if (onExpenseUpdated) {
                onExpenseUpdated();
            }
        } catch (error) {
            console.error("Error updating expense:", error);
            toast.error(`Failed to update expense: ${error.message || 'Unknown error'}`);
        }
    };
    
    // Apply sorting to expenses
    const sortedExpenses = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];
        
        const sortableItems = [...expenses];
        sortableItems.sort((a, b) => {
            // Handle different types of columns
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortConfig.direction === 'asc' 
                    ? dateA - dateB 
                    : dateB - dateA;
            }
            
            if (sortConfig.key === 'amount') {
                const amountA = parseFloat(a.amount);
                const amountB = parseFloat(b.amount);
                return sortConfig.direction === 'asc' 
                    ? amountA - amountB 
                    : amountB - amountA;
            }
            
            if (sortConfig.key === 'category') {
                const catA = a.category || 'Uncategorized';
                const catB = b.category || 'Uncategorized';
                return sortConfig.direction === 'asc' 
                    ? catA.localeCompare(catB) 
                    : catB.localeCompare(catA);
            }
            
            // Default for other columns (title, etc.)
            const valueA = a[sortConfig.key] || '';
            const valueB = b[sortConfig.key] || '';
            return sortConfig.direction === 'asc' 
                ? valueA.localeCompare(valueB) 
                : valueB.localeCompare(valueA);
        });
        
        return sortableItems;
    }, [expenses, sortConfig]);
    
    // Rest of your existing functions
    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            toast.success("Expense deleted successfully");
            if (onExpenseUpdated) {
                onExpenseUpdated();
            }
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    };
    
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (e) {
            return 'Invalid date';
        }
    };
    
    // Your existing category color function
    const getCategoryColor = (category) => {
        const colors = {
            'Food': 'bg-blue-100 text-blue-800',
            'Transport': 'bg-yellow-100 text-yellow-800',
            'Entertainment': 'bg-purple-100 text-purple-800',
            'Utilities': 'bg-green-100 text-green-800',
            'Health': 'bg-red-100 text-red-800',
            'Travel': 'bg-orange-100 text-orange-800',
            'Other': 'bg-gray-100 text-gray-800',
        };
        return colors[category] || 'bg-red-100 text-red-800';
    };
    
    // Helper to render sort indicator
    const getSortIndicator = (columnKey) => {
        // When the column is actively being sorted
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === 'asc' 
                ? <ArrowUp size={14} className="inline ml-1" /> 
                : <ArrowDown size={14} className="inline ml-1" />;
        }
        
        // Default indicators for sortable columns (when not actively sorted)
        switch(columnKey) {
            case 'amount':
                return <SortDesc size={14} className="inline ml-1 opacity-50" />;
            case 'category':
                return <AlignJustify size={14} className="inline ml-1 opacity-50" />;
            case 'date':
                return <Calendar size={14} className="inline ml-1 opacity-50" />;
            default:
                return null;
        }
    };
    
    // Add className for sortable headers
    const getSortHeaderClass = (columnKey) => {
        return `text-left cursor-pointer select-none hover:bg-opacity-10 hover:bg-gray-500 px-2 py-2 rounded ${
            sortConfig.key === columnKey 
                ? isDark ? 'text-emerald-400' : 'text-emerald-600 font-medium'
                : ''
        }`;
    };
    
    return (
        <>
            <div className={`rounded-lg overflow-hidden shadow ${
                isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* Table header with sorting */}
                        <thead>
                            <tr className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                <th className="text-left">#</th>
                                <th className="text-left">Title</th>
                                <th 
                                    className={getSortHeaderClass('amount')}
                                    onClick={() => requestSort('amount')}
                                >
                                    Amount {getSortIndicator('amount')}
                                </th>
                                <th 
                                    className={getSortHeaderClass('category')}
                                    onClick={() => requestSort('category')}
                                >
                                    Category {getSortIndicator('category')}
                                </th>
                                <th 
                                    className={getSortHeaderClass('date')}
                                    onClick={() => requestSort('date')}
                                >
                                    Date {getSortIndicator('date')}
                                </th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        
                        {/* Table body - use sortedExpenses instead of expenses */}
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Loading expenses...
                                    </td>
                                </tr>
                            ) : sortedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No expenses found
                                    </td>
                                </tr>
                            ) : (
                                sortedExpenses.map((expense, index) => (
                                    <tr 
                                        key={expense._id || expense.id} 
                                        className={`
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                            ${isDark ? 'text-gray-200' : 'text-gray-800'}
                                            ${index % 2 === 0 ? isDark ? 'bg-gray-800' : 'bg-white' : isDark ? 'bg-gray-750' : 'bg-gray-50'}
                                        `}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{expense.title}</td>
                                        <td className="font-medium">
                                            ${parseFloat(expense.amount).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                                                {expense.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>{formatDate(expense.date)}</td>
                                        <td className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(expense._id || expense.id)}
                                                className="btn btn-sm btn-ghost"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(expense._id || expense.id)} 
                                                className="btn btn-sm btn-ghost text-red-500"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Edit Expense Modal */}
            <dialog id="edit_expense_modal" className="modal">
                <div className={`modal-box ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <form onSubmit={handleUpdateExpense}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Expense</h3>
                            <button 
                                type="button" 
                                className="btn btn-sm btn-ghost" 
                                onClick={() => document.getElementById('edit_expense_modal').close()}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="form-control mb-3">
                            <label className="label">
                                <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Title</span>
                            </label>
                            <input 
                                type="text" 
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditFormChange}
                                className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`} 
                                required
                            />
                        </div>
                        
                        <div className="form-control mb-3">
                            <label className="label">
                                <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Amount</span>
                            </label>
                            <input 
                                type="number" 
                                name="amount"
                                value={editFormData.amount}
                                onChange={handleEditFormChange}
                                step="0.01"
                                min="0"
                                className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`} 
                                required
                            />
                        </div>
                        
                        <div className="form-control mb-3">
                            <label className="label">
                                <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Category</span>
                            </label>
                            <select 
                                name="category"
                                value={editFormData.category}
                                onChange={handleEditFormChange}
                                className={`select select-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-control mb-3">
                            <label className="label">
                                <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Date</span>
                            </label>
                            <input 
                                type="date" 
                                name="date"
                                value={editFormData.date}
                                onChange={handleEditFormChange}
                                className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`} 
                                required
                            />
                        </div>
                        
                        <div className="form-control mb-5">
                            <label className="label">
                                <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Description (Optional)</span>
                            </label>
                            <textarea 
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                                className={`textarea textarea-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`} 
                                rows="3"
                            ></textarea>
                        </div>
                        
                        <div className="modal-action">
                            <button 
                                type="button" 
                                className="btn btn-outline"
                                onClick={() => document.getElementById('edit_expense_modal').close()}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Update Expense
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}

export default ExpenseTransaction;
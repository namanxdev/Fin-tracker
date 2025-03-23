import React, { useEffect, useState, useMemo } from 'react';
import useIncomeStore from '../../store/incomeStore';
import useThemeStore from '../../store/themeStore';
import { format, parseISO } from 'date-fns';
import { 
    Pencil, 
    Trash2, 
    ArrowUp, 
    ArrowDown, 
    SortDesc, 
    Repeat,
    X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function IncomeTransaction({ refreshTrigger, onIncomeUpdated }) {
    const isDark = useThemeStore(state => state.isDark());
    const incomes = useIncomeStore(state => state.incomes);
    const getIncomes = useIncomeStore(state => state.getIncomes);
    const deleteIncome = useIncomeStore(state => state.deleteIncome);
    const updateIncome = useIncomeStore(state => state.updateIncome);
    const isLoading = useIncomeStore(state => state.isLoading);
    
    // State for editing
    const [editingIncomeId, setEditingIncomeId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
        source: '',
        description: '',
        isRecurring: false,
        recurringFrequency: 'none'
    });
    
    // Categories for dropdown
    const categories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Refund', 'Other'];
    const frequencies = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annually', label: 'Annually' },
        { value: 'none', label: 'None' }
    ];
    
    // Add sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    
    // Fetch incomes when component mounts or refreshTrigger changes
    useEffect(() => {
        getIncomes();
    }, [getIncomes, refreshTrigger]);
    
    // Handle form field changes
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    // Handle edit button click
    const handleEdit = (id) => {
        const income = incomes.find(inc => inc._id === id || inc.id === id);
        if (income) {
            // Format date for input field (YYYY-MM-DD)
            const formattedDate = new Date(income.date).toISOString().split('T')[0];
            
            setEditingIncomeId(id);
            setEditFormData({
                title: income.title || '',
                amount: income.amount || 0,
                category: income.category || 'Salary',
                date: formattedDate,
                source: income.source || '',
                description: income.description || '',
                isRecurring: income.isRecurring || false,
                recurringFrequency: income.recurringFrequency || 'none'
            });
            
            // Open the modal
            document.getElementById('edit_income_modal').showModal();
        } else {
            toast.error("Income not found");
        }
    };
    
    // Handle form submission
    const handleUpdateIncome = async (e) => {
        e.preventDefault();
        
        try {
            // Format the data properly before sending
            const formattedData = {
                ...editFormData,
                amount: parseFloat(editFormData.amount) // Ensure amount is a number
            };
            
            console.log("Formatted Data:", formattedData);
            // Call the update function
            await updateIncome(editingIncomeId, formattedData);
            toast.success("Income updated successfully");
            
            // Close the modal
            document.getElementById('edit_income_modal').close();
            
            // Reset form
            setEditingIncomeId(null);
            setEditFormData({
                title: '',
                amount: '',
                category: '',
                date: '',
                source: '',
                description: '',
                isRecurring: false,
                recurringFrequency: 'none'
            });
            
            // Force refresh incomes
            getIncomes();
            
            // Also trigger refresh callback
            if (onIncomeUpdated) {
                onIncomeUpdated();
            }
        } catch (error) {
            console.error("Error updating income:", error);
            toast.error(`Failed to update income: ${error.message || 'Unknown error'}`);
        }
    };
    
    // Handle delete
    const handleDelete = async (id) => {
        try {
            await deleteIncome(id);
            toast.success("Income deleted successfully");
            if (onIncomeUpdated) {
                onIncomeUpdated();
            }
        } catch (error) {
            toast.error("Failed to delete income");
        }
    };
    
    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };
    
    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    // Get category color
    const getCategoryColor = (category) => {
        switch(category) {
            case 'Salary':
                return isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
            case 'Freelance':
                return isDark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800';
            case 'Investment':
                return isDark ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800';
            case 'Business':
                return isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';
            case 'Gift':
                return isDark ? 'bg-pink-900/50 text-pink-200' : 'bg-pink-100 text-pink-800';
            case 'Refund':
                return isDark ? 'bg-cyan-900/50 text-cyan-200' : 'bg-cyan-100 text-cyan-800';
            default:
                return isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
        }
    };
    
    // Get sorting indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) {
            return <SortDesc size={14} className="opacity-20" />;
        }
        
        return sortConfig.direction === 'asc' 
            ? <ArrowUp size={14} />
            : <ArrowDown size={14} />;
    };
    
    // Sort incomes
    const sortedIncomes = useMemo(() => {
        const sortableItems = [...incomes];
        
        sortableItems.sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return sortConfig.direction === 'asc' 
                    ? dateA - dateB 
                    : dateB - dateA;
            }
            
            if (sortConfig.key === 'amount') {
                const amountA = parseFloat(a.amount || 0);
                const amountB = parseFloat(b.amount || 0);
                return sortConfig.direction === 'asc' 
                    ? amountA - amountB 
                    : amountB - amountA;
            }
            
            if (sortConfig.key === 'category') {
                const catA = a.category || 'Other';
                const catB = b.category || 'Other';
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
    }, [incomes, sortConfig]);
    
    return (
        <>
            <div className={`rounded-lg overflow-hidden shadow ${
                isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className="w-10">#</th>
                                <th className="cursor-pointer" onClick={() => requestSort('title')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Title</span>
                                        {getSortIndicator('title')}
                                    </div>
                                </th>
                                <th className="cursor-pointer" onClick={() => requestSort('amount')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Amount</span>
                                        {getSortIndicator('amount')}
                                    </div>
                                </th>
                                <th className="cursor-pointer" onClick={() => requestSort('category')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Category</span>
                                        {getSortIndicator('category')}
                                    </div>
                                </th>
                                <th className="cursor-pointer" onClick={() => requestSort('date')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Date</span>
                                        {getSortIndicator('date')}
                                    </div>
                                </th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Loading incomes...
                                    </td>
                                </tr>
                            ) : sortedIncomes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No incomes found
                                    </td>
                                </tr>
                            ) : (
                                sortedIncomes.map((income, index) => (
                                    <tr 
                                        key={income._id || income.id} 
                                        className={`
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                            ${isDark ? 'text-gray-200' : 'text-gray-800'}
                                            ${index % 2 === 0 ? isDark ? 'bg-gray-800' : 'bg-white' : isDark ? 'bg-gray-750' : 'bg-gray-50'}
                                        `}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span>{income.title}</span>
                                                {income.isRecurring && (
                                                    <span className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                                                        <Repeat size={12} className="inline mr-1" />
                                                        {income.recurringFrequency.charAt(0).toUpperCase() + income.recurringFrequency.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-medium">
                                            ${parseFloat(income.amount).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(income.category)}`}>
                                                {income.category || 'Other'}
                                            </span>
                                        </td>
                                        <td>{formatDate(income.date)}</td>
                                        <td className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(income._id || income.id)}
                                                className="btn btn-sm btn-ghost"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(income._id || income.id)} 
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
            
            {/* Edit Income Modal */}
            <dialog id="edit_income_modal" className="modal">
                <div className={`modal-box ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <form onSubmit={handleUpdateIncome}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Income</h3>
                            <button 
                                type="button" 
                                className="btn btn-sm btn-ghost" 
                                onClick={() => document.getElementById('edit_income_modal').close()}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-control">
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
                            
                            <div className="form-control">
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
                            
                            <div className="form-control">
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
                            
                            <div className="form-control">
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
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Source</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="source"
                                    value={editFormData.source}
                                    onChange={handleEditFormChange}
                                    className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`} 
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Recurring Income?</span>
                                    <input 
                                        type="checkbox" 
                                        name="isRecurring"
                                        checked={editFormData.isRecurring}
                                        onChange={handleEditFormChange}
                                        className="checkbox checkbox-primary"
                                    />
                                </label>
                                
                                {editFormData.isRecurring && (
                                    <select 
                                        name="recurringFrequency"
                                        value={editFormData.recurringFrequency}
                                        onChange={handleEditFormChange}
                                        className={`select select-bordered w-full mt-2 ${isDark ? 'bg-gray-700 text-white' : ''}`}
                                    >
                                        {frequencies.map(freq => (
                                            <option key={freq.value} value={freq.value}>
                                                {freq.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
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
                                onClick={() => document.getElementById('edit_income_modal').close()}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Update Income
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}

export default IncomeTransaction;
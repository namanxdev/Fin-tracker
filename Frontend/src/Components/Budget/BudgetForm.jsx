import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import useBudgetStore from '../../store/budgetStore';
import useThemeStore from '../../store/themeStore';
import { format } from 'date-fns';
import { 
    standardCategories, 
    categoryIcons, 
    getCategoryColor,
    getPeriodDisplay
} from '../Theme/ThemeIcons';

// Simplify the component props
function BudgetForm({ onBudgetAdded }) {
    
    const isDark = useThemeStore(state => state.isDark());
    const { 
        createBudget, 
        updateUiState 
    } = useBudgetStore();
    
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        period: 'monthly',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        color: '',
        notes: ''
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [showHelp, setShowHelp] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-select color when category changes
        if (name === 'category') {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                color: getCategoryColor(value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Clear validation error when field is updated
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        const errors = {};
        
        if (!formData.category) {
            errors.category = 'Category is required';
        }
        
        if (!formData.limit) {
            errors.limit = 'Budget limit is required';
        } else if (isNaN(formData.limit) || Number(formData.limit) <= 0) {
            errors.limit = 'Budget limit must be a positive number';
        }
        
        if (!formData.startDate) {
            errors.startDate = 'Start date is required';
        }
        
        if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            errors.endDate = 'End date must be after start date';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Format data for API
        const budgetData = {
            ...formData,
            limit: parseFloat(formData.limit)
        };
        
        try {
            await createBudget(budgetData);
            
            // Call the callback if it exists
            if (onBudgetAdded) {
                onBudgetAdded();
            }
            
            // Go back to manage view
            updateUiState({ view: 'manage' });
        } catch (error) {
            // Error is handled by the store, but we could add additional UI feedback here
        }
    };
    
    const handleCancel = () => {
        if (onBudgetAdded) {
            onBudgetAdded();
        } else {
            updateUiState({ view: 'manage' });
        }
    };
    
    return (
        <div className={`p-6 rounded-lg shadow-md ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-orange-500">
                    Create New Budget
                </h3>
                <div className="flex items-center gap-2">
                    <button 
                        type="button"
                        onClick={() => setShowHelp(!showHelp)}
                        className="btn btn-circle btn-sm btn-ghost"
                    >
                        <Info size={18} />
                    </button>
                    <button 
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-circle btn-sm"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
            
            {showHelp && (
                <div className={`mb-6 p-4 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                    <h4 className="font-semibold mb-2">Budget Setup Guide</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>Category:</strong> Select the spending category this budget covers</li>
                        <li><strong>Budget Limit:</strong> Enter the maximum amount you want to spend</li>
                        <li><strong>Period:</strong> Choose how often this budget resets (daily, weekly, monthly, etc.)</li>
                        <li><strong>Start Date:</strong> When this budget begins tracking expenses</li>
                        <li><strong>End Date:</strong> Optional end date for temporary budgets</li>
                    </ul>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Category</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`select select-bordered w-full pl-10 ${
                                    isDark ? 'bg-gray-700 text-white' : ''
                                } ${formErrors.category ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {standardCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {formData.category && (
                                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: getCategoryColor(formData.category) }}>
                                    {categoryIcons[formData.category]}
                                </span>
                            )}
                        </div>
                        {formErrors.category && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
                        )}
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Budget Limit ($)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                name="limit"
                                value={formData.limit}
                                onChange={handleChange}
                                className={`input input-bordered w-full pl-8 ${
                                    isDark ? 'bg-gray-700 text-white' : ''
                                } ${formErrors.limit ? 'border-red-500' : ''}`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        {formErrors.limit && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.limit}</p>
                        )}
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Period</span>
                        </label>
                        <select
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
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
                        <p className="text-xs text-gray-500 mt-1">
                            A {getPeriodDisplay(formData.period).toLowerCase()} budget will reset every {formData.period.slice(0, -2)}
                        </p>
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text mb-2 ${isDark ? 'text-gray-300' : ''}`}>Notes (Optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className={`textarea textarea-bordered w-full ${
                                isDark ? 'bg-gray-700 text-white' : ''
                            }`}
                            rows="2"
                            placeholder="Add any additional details or reminders..."
                        ></textarea>
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Start Date</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`input input-bordered w-full ${
                                isDark ? 'bg-gray-700 text-white' : ''
                            } ${formErrors.startDate ? 'border-red-500' : ''}`}
                            required
                        />
                        {formErrors.startDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
                        )}
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>End Date (Optional)</span>
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={`input input-bordered w-full ${
                                isDark ? 'bg-gray-700 text-white' : ''
                            } ${formErrors.endDate ? 'border-red-500' : ''}`}
                            min={formData.startDate}
                        />
                        {formErrors.endDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank for recurring budgets
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-gradient-to-r from-orange-500 to-purple-500 border-none text-white hover:from-orange-600 hover:to-purple-600"
                    >
                        Create Budget
                    </button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                    <p>Note: Category colors are automatically assigned based on the selected category for consistency.</p>
                </div>
            </form>
        </div>
    );
}

export default BudgetForm;
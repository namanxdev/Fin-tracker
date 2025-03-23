import { useState } from 'react';
import useIncomeStore from '../../store/incomeStore';
import useThemeStore from '../../store/themeStore';
import { toast } from 'react-hot-toast';

function IncomeForm({ onIncomeAdded }) {
    const isDark = useThemeStore(state => state.isDark());
    const createIncome = useIncomeStore(state => state.createIncome);
    const updateUiState = useIncomeStore(state => state.updateUiState);
    
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Salary',
        date: new Date().toISOString().split('T')[0],
        source: '',
        description: '',
        isRecurring: false,
        recurringFrequency: 'monthly'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const categories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Refund', 'Other'];
    const frequencies = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annually', label: 'Annually' }
    ];
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Save last used category
        if (name === 'category') {
            updateUiState({ lastCategory: value });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate amount
        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Format data for API
            const incomeData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date,
                source: formData.source,
                isRecurring: formData.isRecurring,
                recurringFrequency: formData.isRecurring ? formData.recurringFrequency : 'none'
            };
            
            await createIncome(incomeData);
            
            // Reset form
            setFormData({
                title: '',
                amount: '',
                category: formData.category, // Keep the same category for convenience
                date: new Date().toISOString().split('T')[0],
                source: '',
                description: '',
                isRecurring: false,
                recurringFrequency: 'monthly'
            });
            
            toast.success('Income added successfully');
            
            if (onIncomeAdded) {
                onIncomeAdded();
            }
        } catch (error) {
            console.error('Failed to add income:', error);
            toast.error('Failed to add income');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Title</span>
                    </label>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter income title"
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
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
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
                        value={formData.category}
                        onChange={handleChange}
                        className={`select select-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`}
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
                        value={formData.date}
                        onChange={handleChange}
                        className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`}
                    />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Source</span>
                    </label>
                    <input 
                        type="text" 
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="Income source (optional)"
                        className={`input input-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`}
                    />
                </div>
                
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Recurring Income?</span>
                        <input 
                            type="checkbox" 
                            name="isRecurring"
                            checked={formData.isRecurring}
                            onChange={handleChange}
                            className="checkbox checkbox-primary"
                        />
                    </label>
                    
                    {formData.isRecurring && (
                        <select 
                            name="recurringFrequency"
                            value={formData.recurringFrequency}
                            onChange={handleChange}
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
            
            <div className="form-control">
                <label className="label">
                    <span className={`label-text ${isDark ? 'text-gray-300' : ''}`}>Description (optional)</span>
                </label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about this income"
                    className={`textarea textarea-bordered w-full ${isDark ? 'bg-gray-700 text-white' : ''}`}
                    rows="3"
                ></textarea>
            </div>
            
            <div className="form-control mt-6">
                <button 
                    type="submit"
                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Income'}
                </button>
            </div>
        </form>
    );
}

export default IncomeForm;
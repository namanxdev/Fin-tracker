import React from 'react'
import { useForm } from 'react-hook-form'
import useExpenseStore from '../../store/expenseStore'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { RepeatIcon } from 'lucide-react' // Add this import for an icon

// Update schema to include isRecurring
const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    amount: z.string()
        .transform((val) => {
            const parsed = parseFloat(val);
            if (isNaN(parsed)) throw new Error("Invalid number");
            return parsed;
        })
        .refine((val) => val > 0, { message: "Amount must be positive" }),
    date: z.string().optional(),
    category: z.string().optional(),
    isRecurring: z.boolean().optional().default(false)
})

function ExpensesForm({ onExpenseAdded }) {
    // Categories array
    const categories = [
        'Food', 'Housing', 'Transport', 'Entertainment', 
        'Health', 'Education', 'Personal', 'Utilities', 
        'Shopping', 'Travel',  'Other'
    ];

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            category: '',
            isRecurring: false // Add default value for isRecurring
        },
        resolver: zodResolver(schema),
    });

    // Get createExpense directly to avoid infinite loop
    const createExpense = useExpenseStore(state => state.createExpense);

    const onSubmit = async (data) => {
        try {
            // Ensure all required fields are present
            const expenseData = {
                title: data.title,
                amount: parseFloat(data.amount),
                date: data.date,
                category: data.category || 'Other',
                isRecurring: data.isRecurring // Include isRecurring field in submission
            };
            
            console.log("Expense data to submit:", expenseData);
            const result = await createExpense(expenseData);
            console.log("Backend response:", result);
            toast.success("Expense added successfully");
            reset();
    
            if(onExpenseAdded) {
                onExpenseAdded();
            }
        } catch (error) {
            toast.error("Failed to add expense");
            console.error(error);
        }
    }

    return (
        <div>
            <form className="gap-2 flex flex-col " onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("title", { required: true })}
                    type="text"
                    placeholder="Title"
                    className="border p-2 rounded-md border-red-500"
                />
                {errors.title && <div className="text-red-500">{errors.title.message}</div>}

                <input
                    {...register("amount", { required: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount"
                    className="border p-2 rounded-md border-red-500"
                />
                {errors.amount && <div className="text-red-500">{errors.amount.message}</div>}

                <input
                    {...register("date")}
                    type="date"
                    placeholder="Date"
                    className="border p-2 rounded-md border-red-500"
                />

                <div className='flex flex-row justify-between items-center'>
                    {/* Category Dropdown */}
                    <div className="form-control flex-grow mr-4">
                        <select 
                            className="select select-error w-full"
                            {...register("category")}
                            defaultValue=""
                        >
                            <option disabled value="">Select Category</option>
                            {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                            ))}
                        </select>
                        {errors.category && <div className="text-red-500">{errors.category.message}</div>}
                    </div>
                    
                    {/* Recurring expense checkbox - properly registered */}
                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            id="isRecurring"
                            {...register("isRecurring")} 
                            className="checkbox checkbox-success" 
                        />
                        <label htmlFor="isRecurring" className="text-sm cursor-pointer flex items-center">
                            <RepeatIcon className="h-4 w-4 mr-1" />
                            Recurring
                        </label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md mt-2 transition-all"
                >
                    Add Expense
                </button>
            </form>
        </div>
    )
}

export default ExpensesForm
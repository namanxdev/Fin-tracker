import React from 'react'
import { useForm } from 'react-hook-form'
import useExpenseStore from '../../store/expenseStore'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { MoveUp } from 'lucide-react'

// Update your schema
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
})

function ExpensesForm({ onExpenseAdded }) {
    // Categories array
    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Travel', 'Other']

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            category: ''
        },
        resolver: zodResolver(schema),
    });

    // Watch category to show the current selection
    const selectedCategory = watch("category");

    // Get createExpense directly to avoid infinite loop
    const createExpense = useExpenseStore(state => state.createExpense);

    const onSubmit = async (data) => {
        try {
            // Ensure all required fields are present
            const expenseData = {
                title: data.title, // Explicitly include title
                amount: parseFloat(data.amount),
                date: data.date,
                category: data.category || 'Other' // Provide a default category if empty
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

    // Handle category selection
    const handleCategorySelect = (category) => {
        setValue("category", category);
    };

    return (
        <div>
            <form className="gap-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("title", { required: true })}
                    type="text"
                    placeholder="Title"
                    className="border p-2 rounded-md"
                />
                {errors.title && <div className="text-red-500">{errors.title.message}</div>}

                <input
                    {...register("amount", { required: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount"
                    className="border p-2 rounded-md"
                />
                {errors.amount && <div className="text-red-500">{errors.amount.message}</div>}

                <input
                    {...register("date")}
                    type="date"
                    placeholder="Date"
                    className="border p-2 rounded-md"
                />

                {/* Hidden input to store the actual category value */}
                <input type="hidden" {...register("category")} />
                
                {/* Category Dropdown */}
                <div className="relative">
                    <div className="dropdown dropdown-bottom w-full">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="border p-2 rounded-md w-full text-left flex justify-between items-center"
                        >
                            {selectedCategory || "Select Category"} 
                            <span className="transform rotate-180"><MoveUp /></span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-20 w-full p-2 shadow-lg mt-1">
                            {categories.map((cat, index) => (
                                <li key={index}>
                                    <a 
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`py-2 ${selectedCategory === cat ? "bg-gray-100 font-medium" : ""}`}
                                    >
                                        {cat}
                                    </a>
                                </li>
                            ))}
                        </ul>
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
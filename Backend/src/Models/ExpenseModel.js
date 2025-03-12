import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        trim: true,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
        // Default value is set to 'Cash' to ensure that all expenses have a payment method
        default: 'Cash'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        trim: true
    },
    }, {
    timestamps: true
});

// Add virtual for expense's ID (for frontend compatibility)
ExpenseSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
ExpenseSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
    }
});

// Create indexes for faster queries
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;
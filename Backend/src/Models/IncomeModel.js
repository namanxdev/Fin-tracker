import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        set: function(value) {
            return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
        }
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Refund', 'Other'],
        trim: true,
        set: function(value) {
            return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
        }
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        trim: true,
        default: 'Other'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'none'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Add virtual for income's ID (for frontend compatibility)
IncomeSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
IncomeSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
    }
});

// Create indexes for faster queries
IncomeSchema.index({ user: 1, date: -1 });
IncomeSchema.index({ user: 1, category: 1 });

const Income = mongoose.model('Income', IncomeSchema);

export default Income;
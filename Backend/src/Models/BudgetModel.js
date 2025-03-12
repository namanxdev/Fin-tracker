import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    limit: {
        type: Number,
        required: [true, 'Budget limit is required'],
        min: [0, 'Budget limit cannot be negative']
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    rollover: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        default: '#3498db'
    },
    isActive: {
        type: Boolean,
        default: true
    }
    }, {
    timestamps: true
});

// Add virtual for calculating end date based on period (if not explicitly defined)
BudgetSchema.virtual('calculatedEndDate').get(function() {
    if (this.endDate) return this.endDate;
    
    const start = new Date(this.startDate);
    const end = new Date(start);
    
    switch (this.period) {
        case 'daily':
        end.setDate(start.getDate() + 1);
        break;
        case 'weekly':
        end.setDate(start.getDate() + 7);
        break;
        case 'monthly':
        end.setMonth(start.getMonth() + 1);
        break;
        case 'quarterly':
        end.setMonth(start.getMonth() + 3);
        break;
        case 'yearly':
        end.setFullYear(start.getFullYear() + 1);
        break;
        default:
        end.setMonth(start.getMonth() + 1);
    }
    
return end;
});

// Add virtual for budget's ID (for frontend compatibility)
BudgetSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
BudgetSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
    }
});

// Create indexes for faster queries
BudgetSchema.index({ user: 1, category: 1 });
BudgetSchema.index({ user: 1, startDate: -1 });

const Budget = mongoose.model('Budget', BudgetSchema);

export default Budget;
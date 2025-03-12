import express from 'express';
import Expense from '../models/expenseModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        
        const newExpense = new Expense({
        user: req.user.id,
        amount,
        category,
        description,
        date: date || Date.now()
        });
        
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({ 
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        
        // Find expense by ID
        let expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
        }
        
        // Update expense fields
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description || expense.description;
        expense.date = date || expense.date;
        
        // Save updated expense
        await expense.save();
        
        res.json(expense);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
        }
        
        await expense.remove();
        
        res.json({ message: 'Expense removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/expenses/summary/categories
// @desc    Get expense summary by categories
// @access  Private
router.get('/summary/categories', auth, async (req, res) => {
    try {
        const categorySummary = await Expense.aggregate([
        { $match: { user: req.user.id } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
        ]);
        
        res.json(categorySummary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    });

    // @route   GET /api/expenses/summary/monthly
    // @desc    Get monthly expense summary
    // @access  Private
    router.get('/summary/monthly', auth, async (req, res) => {
    try {
        const monthlySummary = await Expense.aggregate([
        { $match: { user: req.user.id } },
        {
            $group: {
            _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
            },
            total: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);
        
        res.json(monthlySummary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
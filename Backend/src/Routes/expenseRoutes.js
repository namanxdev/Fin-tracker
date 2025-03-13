import express from 'express';
import Expense from '../models/expenseModel.js';
import auth from '../middleware/auth.js';
import {ExpressError} from '../middleware/ErrorHandler.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// @access  Private
router.get('/', auth, async (req, res,next) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        if(!expenses){
            return next(new ExpressError("No expenses found", 404));
        }
        res.json(expenses);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Server error' });
        next(new ExpressError("Unable to Get expenses",404));
    }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, async (req, res,next) => {
    try {
        const { amount, category, description,date,paymentMethod,isRecurring } = req.body;
        
        if(!amount){
            return next(new ExpressError("Amount is required", 400));
        }
        if(!category){
            return next(new ExpressError("Category is required", 400));
        }
        const newExpense = new Expense({
        user: req.user.id,
        amount,
        category,
        description,
        date: date || Date.now(),
        paymentMethod,
        isRecurring
        });
        
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to create expense", 500));
    }
});

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res,next) => {
    try {
        const expense = await Expense.findOne({ 
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!expense) {
            return next(new ExpressError("Expense not found", 404));
        }
        
        res.json(expense);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Expense not found' });
        }
        next(new ExpressError(error.message, 500));
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, async (req, res,next) => {
    try {
        const { amount, category, description, date } = req.body;
        
        // Find expense by ID
        let expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if(!amount){
            return next(new ExpressError("Amount is required", 400));
        }
        if(!category){
            return next(new ExpressError("Category is required", 400));
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
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
    
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
    
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
router.get('/summary/categories', auth, async (req, res,next) => {
    try {
        const categorySummary = await Expense.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
        ]);
        if(categorySummary.length===0){
            return next(new ExpressError("No categories found", 404));
        }
        
        res.json(categorySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get category summary", 500));
    }
    });

    // @route   GET /api/expenses/summary/monthly
    // @desc    Get monthly expense summary
    // @access  Private
    router.get('/summary/monthly', auth, async (req, res,next) => {
    try {
        const monthlySummary = await Expense.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
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

        if (monthlySummary.length === 0) {
            return next(new ExpressError("No monthly data found", 404));
        }
        
        res.json(monthlySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get monthly summary", 500));
    }
});

// @route   GET /api/expenses/summary/yearly
// @desc    Get yearly expense summary
// @access  Private
router.get('/summary/yearly', auth, async (req, res, next) => {
    try {
        const yearlySummary = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: { year: { $year: '$date' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }  // Count of expenses
                }
            },
            { $sort: { '_id.year': -1 } }
        ]);
        
        if (yearlySummary.length === 0) {
            return next(new ExpressError("No yearly data found", 404));
        }
        
        res.json(yearlySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get yearly summary", 500));
    }
});

// @route   GET /api/expenses/summary/by-month/:year/:month
// @desc    Get expense summary for a specific month
// @access  Private
router.get('/summary/by-month/:year/:month', auth, async (req, res, next) => {
    try {
        const { year, month } = req.params;
        
        // Validate year and month
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        
        if (isNaN(yearNum) || isNaN(monthNum)) {
            return next(new ExpressError("Year and month must be numbers", 400));
        }
        
        if (monthNum < 1 || monthNum > 12) {
            return next(new ExpressError("Month must be between 1 and 12", 400));
        }
        
        // Create date range for the specified month
        const startDate = new Date(yearNum, monthNum - 1, 1); // Month is 0-indexed in JS Date
        const endDate = new Date(yearNum, monthNum, 0); // Last day of the month
        
        // Get expenses for this month
        const expenses = await Expense.find({
            user: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
        
        // Group by category
        const categorySummary = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: startDate, $lte: endDate }
                } 
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        
        // Calculate statistics
        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
        
        if (expenses.length === 0) {
            return next(new ExpressError(`No expenses found for ${month}/${year}`, 404));
        }
        
        res.json({
            year: yearNum,
            month: monthNum,
            totalExpenses: expenses.length,
            totalAmount,
            averageAmount,
            byCategory: categorySummary,
            expenses: expenses
        });
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get month summary", 500));
    }
});

// @route   GET /api/expenses/summary/date-range
// @desc    Get expense summary for a custom date range
// @access  Private
router.get('/summary/date-range', auth, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return next(new ExpressError("Start date and end date are required", 400));
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return next(new ExpressError("Invalid date format", 400));
        }
        
        const expenses = await Expense.find({
            user: req.user.id,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });
        
        const categorySummary = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: start, $lte: end }
                } 
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        
        if (expenses.length === 0) {
            return next(new ExpressError("No expenses found in the specified date range", 404));
        }
        
        res.json({
            startDate: start,
            endDate: end,
            totalExpenses: expenses.length,
            totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
            byCategory: categorySummary,
            expenses: expenses
        });
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get date range summary", 500));
    }
});


export default router;
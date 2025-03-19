import Expense from '../Models/ExpenseModel.js';
import { ExpressError } from '../utils/ErrorHandler.js';
import mongoose from 'mongoose';

// @desc    Get all expenses for a user
// @access  Private
export const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        if (!expenses) {
        return next(new ExpressError("No expenses found", 404));
        }
        res.json(expenses);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Unable to get expenses", 404));
    }
};

// @desc    Create a new expense
// @access  Private
export const createExpense = async (req, res, next) => {
    try {
        const { title,amount, category, description, date, paymentMethod, isRecurring } = req.body;
        
        if (!title) {
            return next(new ExpressError("Title is required", 400));
        }

        if (!amount) {
        return next(new ExpressError("Amount is required", 400));
        }
        if (!category) {
        return next(new ExpressError("Category is required", 400));
        }
        
        let parsedDate;
        if(date){
            if(date.includes('-') && date.length ===8){
                const[day,month,year] = date.split('-');
                parsedDate = new Date(`${year}-${month}-${day}`);
            }else{
                parsedDate = new Date(date);
            }
            if(isNaN(parsedDate.getTime())){
                return next(new ExpressError("Invalid date format", 400));
            }
        }else{
            parsedDate = new Date();
        }


        const newExpense = new Expense({
        user: req.user.id,
        title,
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
    };

    // @desc    Get expense by ID
    // @access  Private
    export const getExpenseById = async (req, res, next) => {
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
};

// @desc    Update an expense
// @access  Private
export const updateExpense = async (req, res, next) => {
    try {
        const { title,amount, category, description, date, paymentMethod, isRecurring } = req.body;
        
        // Find expense by ID
        let expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!expense) {
        return next(new ExpressError("Expense not found", 404));
        }
        
        if (!amount) {
        return next(new ExpressError("Amount is required", 400));
        }
        if (!category) {
        return next(new ExpressError("Category is required", 400));
        }
        
        // Update expense fields
        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description || expense.description;
        expense.date = date || expense.date;
        expense.paymentMethod = paymentMethod || expense.paymentMethod;
        expense.isRecurring = isRecurring !== undefined ? isRecurring : expense.isRecurring;
        
        // Save updated expense
        await expense.save();
        
        res.json(expense);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return next(new ExpressError("Expense not found", 404));
        }
        next(new ExpressError("Failed to update expense", 500));
    }
    };

    // @desc    Delete an expense
    // @access  Private
    export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
        });

        if (!expense) {
        return next(new ExpressError("Expense not found", 404));
        }

        res.json({ message: 'Expense removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return next(new ExpressError("Expense not found", 404));
        }
        next(new ExpressError("Failed to delete expense", 500));
    }
};

// @desc    Get expense summary by categories
// @access  Private
export const getCategorySummary = async (req, res, next) => {
    try {
        const categorySummary = await Expense.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
        ]);
        
        // if (categorySummary.length === 0) {
        // return next(new ExpressError("No categories found", 404));
        // }
        
        res.json(categorySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get category summary", 500));
    }
    };

    // @desc    Get monthly expense summary
    // @access  Private
    export const getMonthlySummary = async (req, res, next) => {
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
    };

    // @desc    Get yearly expense summary
    // @access  Private
    export const getYearlySummary = async (req, res, next) => {
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
};

// @desc    Get expense summary for a specific month
// @access  Private
export const getMonthExpenses = async (req, res, next) => {
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
};

// @desc    Get expense summary for a custom date range
// @access  Private
export const getDateRangeExpenses = async (req, res, next) => {
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

        if(start > end){
            return next(new ExpressError("Start date cannot be greater than end date", 400));
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
};
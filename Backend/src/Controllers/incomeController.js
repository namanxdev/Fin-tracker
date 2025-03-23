import Income from '../Models/IncomeModel.js';
import { ExpressError } from '../utils/ErrorHandler.js';
import mongoose from 'mongoose';

// @desc    Get all incomes for a user
// @access  Private
export const getIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
        // if(!incomes || incomes.length === 0) {
        //     res.send({ message: "No incomes found" });      
        //     return
        // }
        res.json(incomes|| []);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Unable to get incomes", 500));
    }
};

// @desc    Create a new income
// @access  Private
export const createIncome = async (req, res, next) => {
    try {
        const {title ,amount, category, description, date, source, isRecurring, recurringFrequency } = req.body;
        
        if (!amount) {
            return next(new ExpressError("Amount is required", 400));
        }
        if (!category) {
            return next(new ExpressError("Category is required", 400));
        }
        
        let parsedDate;
        if(date){
            if(date.includes('-') && date.length === 8){
                const[day, month, year] = date.split('-');
                parsedDate = new Date(`${year}-${month}-${day}`);
            } else {
                parsedDate = new Date(date);
            }
            if(isNaN(parsedDate.getTime())){
                return next(new ExpressError("Invalid date format", 400));
            }
        } else {
            parsedDate = new Date();
        }

        const newIncome = new Income({
            user: req.user.id,
            title,
            amount,
            category,
            description,
            date: parsedDate,
            source,
            isRecurring,
            recurringFrequency: isRecurring ? (recurringFrequency || 'monthly') : 'none'
        });
        
        const savedIncome = await newIncome.save();
        res.status(201).json(savedIncome);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to create income", 500));
    }
};

// @desc    Get income by ID
// @access  Private
export const getIncomeById = async (req, res, next) => {
    try {
        const income = await Income.findOne({ 
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!income) {
            return next(new ExpressError("Income not found", 404));
        }
        
        res.json(income);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return next(new ExpressError("Invalid income ID format", 400));
        }
        next(new ExpressError("Server error", 500));
    }
};

// @desc    Update an income
// @access  Private
export const updateIncome = async (req, res, next) => {
    try {
        const { title,amount, category, description, date, source, isRecurring, recurringFrequency } = req.body;
        
        let income = await Income.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!income) {
            return next(new ExpressError("Income not found", 404));
        }
        
        // Update income fields
        income.title = title || income.title;
        income.amount = amount || income.amount;
        income.category = category || income.category;
        income.description = description !== undefined ? description : income.description;
        income.date = date || income.date;
        income.source = source || income.source;
        income.isRecurring = isRecurring !== undefined ? isRecurring : income.isRecurring;
        income.recurringFrequency = isRecurring ? (recurringFrequency || income.recurringFrequency) : 'none';
        
        await income.save();
        
        res.json(income);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return next(new ExpressError("Invalid income ID format", 400));
        }
        next(new ExpressError("Failed to update income", 500));
    }
};

// @desc    Delete an income
// @access  Private
export const deleteIncome = async (req, res, next) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!income) {
            return next(new ExpressError("Income not found", 404));
        }

        res.json({ message: 'Income removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return next(new ExpressError("Income not found", 404));
        }
        next(new ExpressError("Failed to delete income", 500));
    }
};

// @desc    Get income summary by categories
// @access  Private
export const getCategorySummary = async (req, res, next) => {
    try {
        const categorySummary = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        
        res.json(categorySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get category summary", 500));
    }
};

// @desc    Get monthly income summary
// @access  Private
export const getMonthlySummary = async (req, res, next) => {
    try {
        const monthlySummary = await Income.aggregate([
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
        
        res.json(monthlySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get monthly summary", 500));
    }
};

// @desc    Get income summary for a year
// @access  Private
export const getYearlySummary = async (req, res, next) => {
    try {
        const yearlySummary = await Income.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: { $year: '$date' },  // Group by year only
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }  // Sort ascending by year
        ]);
        
        res.json(yearlySummary);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Failed to get yearly summary", 500));
    }
};
import Budget from '../Models/BudgetModel.js';
import Expense from '../Models/ExpenseModel.js';
import mongoose from 'mongoose';
import { ExpressError } from '../utils/ErrorHandler.js';

// @desc    Get all budgets for a user
// @access  Private
export const getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });


        if (!budgets) {
            budgets = [];
        }

        res.json(budgets);
    } catch (error) {
        console.error(error);
        next(new ExpressError('Server error', 500));
    }
};

// @desc    Create a new budget
// @access  Private
export const createBudget = async (req, res, next) => {
    try {
        const { category, limit, period, startDate, endDate } = req.body;

        if (!category) {
        return next(new ExpressError('Category is required', 400));
        }
        
        if (!limit) {
        return next(new ExpressError('Budget limit is required', 400));
        }
        
        // Check if budget for this category already exists
        const existingBudget = await Budget.findOne({
        user: req.user.id,
        category
        });
        
        if (existingBudget) {
        return next(new ExpressError('Budget for this category already exists', 400));
        }
        
        const newBudget = new Budget({
        user: req.user.id,
        category,
        limit,
        period: period || 'monthly',
        startDate: startDate || Date.now(),
        endDate: endDate || null,
        rollover: false,
        });
        
        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        console.error(error);
        next(new ExpressError('Failed to create budget', 500));
    }
};

// @desc    Get status of all budgets compared to actual spending
// @access  Private
export const getBudgetStatuses = async (req, res, next) => {
    try {
        // Fetch all budgets for the authenticated user
        const budgets = await Budget.find({ user: req.user.id });
        if (!budgets || budgets.length === 0) {
            return res.status(200).json({ message: "No budgets found" });
        }

        // Process each budget
        const budgetsStatus = await Promise.all(budgets.map(async (budget) => {
            // Important fix: Ensure we have proper date objects
            const startDate = new Date(budget.startDate);
            const endDate = budget.endDate ? new Date(budget.endDate) : budget.calculatedEndDate;
            
            // For monthly budgets, we should consider the full month
            let adjustedStartDate = startDate;
            let adjustedEndDate = endDate;
            
            if (budget.period === 'monthly') {
                // Set start date to beginning of month for "monthly" budgets
                adjustedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                
                // Set end date to end of month for "monthly" budgets
                adjustedEndDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            }
            
            
            // Use an aggregation pipeline to sum expenses for this budget's category and time period
            // IMPORTANT: Check if your Expense model uses 'date' or 'createdAt' field
            const expensesAgg = await Expense.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(req.user.id),
                        category: budget.category,
                        // Use adjusted date range for better results
                        date: { $gte: adjustedStartDate, $lte: adjustedEndDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSpent: { $sum: '$amount' }
                    }
                }
            ]);
            
            // console.log(`Found spending for ${budget.category}: ${
            //     expensesAgg.length > 0 ? expensesAgg[0].totalSpent : 'No expenses found'
            // }`);
            
            const totalSpent = expensesAgg.length > 0 ? expensesAgg[0].totalSpent : 0;

            // Determine the status based on spending vs. limit
            let status;
            if (totalSpent > budget.limit) {
                status = "Over Budget";
            } else if (totalSpent === budget.limit) {
                status = "At Budget";
            } else {
                status = "Under Budget";
            }

            // Return a summary object for this budget
            return {
                budgetId: budget._id,
                category: budget.category,
                limit: budget.limit,
                period: budget.period,
                startDate: adjustedStartDate,
                endDate: adjustedEndDate,
                totalSpent,
                status
            };
        }));

        res.json(budgetsStatus);
    } catch (error) {
        console.error(error);
        next(new ExpressError("Server error: unable to retrieve budget statuses", 500));
    }
};

// @desc    Get budget by ID
// @access  Private
export const getBudgetById = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!budget) {
        return next(new ExpressError('Budget not found', 404));
        }
        
        res.json(budget);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return next(new ExpressError('Invalid budget ID format', 400));
        }
        next(new ExpressError('Server error', 500));
    }
};

// @desc    Update a budget
// @access  Private
export const updateBudget = async (req, res, next) => {
    try {
        const { category, limit, period, startDate, endDate } = req.body;
        
        // Find budget by ID
        let budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!budget) {
        return next(new ExpressError('Budget not found', 404));
        }
        
        // Update budget fields
        budget.category = category || budget.category;
        budget.limit = limit || budget.limit;
        budget.period = period || budget.period;
        budget.startDate = startDate || budget.startDate;
        budget.endDate = endDate !== undefined ? endDate : budget.endDate;
        
        // Save updated budget
        await budget.save();
        
        res.json(budget);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return next(new ExpressError('Invalid budget ID format', 400));
        }
        next(new ExpressError('Failed to update budget', 500));
    }
};

// @desc    Delete a budget
// @access  Private
export const deleteBudget = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
        });
        
        if (!budget) {
        return next(new ExpressError('Budget not found', 404));
        }
        
        await Budget.deleteOne({ _id: req.params.id });
        
        res.json({ message: 'Budget removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
        return next(new ExpressError('Invalid budget ID format', 400));
        }
        next(new ExpressError('Failed to delete budget', 500));
    }
};
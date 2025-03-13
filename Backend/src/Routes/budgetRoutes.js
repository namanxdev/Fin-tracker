import express from 'express';
import Budget from '../Models/BudgetModel.js';
import Expense from '../Models/ExpenseModel.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';
import { ExpressError } from '../middleware/ErrorHandler.js';


const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for a user
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    if (!budgets || budgets.length === 0) {
      return next(new ExpressError('No budgets found', 404));
    }

    res.json(budgets);
  } catch (error) {
    console.error(error);
    next(new ExpressError('Server error', 500));
  }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, async (req, res, next) => {
  try {
    const { category, limit, period, startDate,endDate} = req.body;

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
});

// @route   GET /api/budgets/status/all
// @desc    Get status of all budgets compared to actual spending
// @access  Private

router.get('/status/all', auth, async (req, res, next) => {
  try {
      // Fetch all budgets for the authenticated user
      const budgets = await Budget.find({ user: req.user.id });
      if (!budgets || budgets.length === 0) {
          return next(new ExpressError("No budgets found", 404));
      }

      // Process each budget
      const budgetsStatus = await Promise.all(budgets.map(async (budget) => {
          // Use the defined start date, and determine the end date:
          // if budget.endDate is provided, use it; otherwise, use the calculatedEndDate virtual.
          const start = budget.startDate;
          const end = budget.endDate ? budget.endDate : budget.calculatedEndDate;

          // Use an aggregation pipeline to sum expenses for this budget's category and time period
          const expensesAgg = await Expense.aggregate([
              {
                  $match: {
                      user: new mongoose.Types.ObjectId(req.user.id),
                      category: budget.category,
                      date: { $gte: new Date(start), $lte: new Date(end) }
                  }
              },
              {
                  $group: {
                      _id: null,
                      totalSpent: { $sum: '$amount' }
                  }
              }
          ]);
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
              startDate: budget.startDate,
              endDate: budget.endDate ? budget.endDate : budget.calculatedEndDate,
              totalSpent,
              status
          };
      }));

      res.json(budgetsStatus);
  } catch (error) {
      console.error(error);
      next(new ExpressError("Server error: unable to retrieve budget statuses", 500));
  }
});

// @route   GET /api/budgets/:id
// @desc    Get budget by ID
// @access  Private
router.get('/:id', auth, async (req, res, next) => {
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
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { category, limit, period, startDate } = req.body;
    
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
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
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
});



export default router;
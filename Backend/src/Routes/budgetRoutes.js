import express from 'express';
import Budget from '../models/budgetModel.js';
import Expense from '../models/expenseModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, period, startDate } = req.body;
    
    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category
    });
    
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists' });
    }
    
    const newBudget = new Budget({
      user: req.user.id,
      category,
      limit,
      period: period || 'monthly',
      startDate: startDate || Date.now()
    });
    
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/budgets/:id
// @desc    Get budget by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.json(budget);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, limit, period, startDate } = req.body;
    
    // Find budget by ID
    let budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
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
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    await budget.remove();
    
    res.json({ message: 'Budget removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/budgets/status/all
// @desc    Get status of all budgets compared to actual spending
// @access  Private
// router.get('/status/all', auth, async (req, res) => {
//     try {
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error BudgetRoutes::/status' });
        
//     }
// })

export default router;
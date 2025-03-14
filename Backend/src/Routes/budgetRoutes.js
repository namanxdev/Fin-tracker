import express from 'express';
import auth from '../middleware/auth.js';
import {
  getBudgets,
  createBudget,
  getBudgetStatuses,
  getBudgetById,
  updateBudget,
  deleteBudget
} from '../Controllers/budgetController.js';

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for a user
// @access  Private
router.get('/', auth, getBudgets);

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, createBudget);

// @route   GET /api/budgets/status/all
// @desc    Get status of all budgets compared to actual spending
// @access  Private
router.get('/status/all', auth, getBudgetStatuses);

// @route   GET /api/budgets/:id
// @desc    Get budget by ID
// @access  Private
router.get('/:id', auth, getBudgetById);

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', auth, updateBudget);

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, deleteBudget);

export default router;
import express from 'express';
import auth from '../Middleware/auth.js';
import { validateRequest } from '../Middleware/validateMiddleware.js'; 
import { expenseSchema } from '../Schema.js';
import {
    getExpenses,
    createExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getCategorySummary,
    getMonthlySummary,
    getYearlySummary,
    getMonthExpenses,
    getDateRangeExpenses
} from '../Controllers/expenseController.js';

const router = express.Router();

// Summary routes should come before the /:id route
// @route   GET /api/expenses/summary/categories
// @desc    Get expense summary by categories
// @access  Private
router.get('/summary/categories', auth, getCategorySummary);

// @route   GET /api/expenses/summary/monthly
// @desc    Get monthly expense summary
// @access  Private
router.get('/summary/monthly', auth, getMonthlySummary);

// @route   GET /api/expenses/summary/yearly
// @desc    Get yearly expense summary
// @access  Private
router.get('/summary/yearly', auth, getYearlySummary);

// @route   GET /api/expenses/summary/by-month/:year/:month
// @desc    Get expense summary for a specific month
// @access  Private
router.get('/summary/by-month/:year/:month', auth, getMonthExpenses);

// @route   GET /api/expenses/summary/date-range
// @desc    Get expense summary for a custom date range
// @access  Private
router.get('/summary/date-range', auth, getDateRangeExpenses);

// Standard CRUD routes
// @route   GET /api/expenses
// @desc    Get all expenses for a user
// @access  Private
router.get('/', auth, getExpenses);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, validateRequest(expenseSchema) ,createExpense);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, getExpenseById);

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, validateRequest(expenseSchema) ,updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

export default router;
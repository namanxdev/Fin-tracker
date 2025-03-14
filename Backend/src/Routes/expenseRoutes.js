import express from 'express';
import auth from '../middleware/auth.js';
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
} from '../controllers/expenseController.js';

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// @access  Private
router.get('/', auth, getExpenses);

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, createExpense);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, getExpenseById);

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

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

export default router;
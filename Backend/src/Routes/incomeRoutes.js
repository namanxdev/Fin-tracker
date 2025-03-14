import express from 'express';
import auth from '../middleware/auth.js';
import {
    getIncomes,
    createIncome,
    getIncomeById,
    updateIncome,
    deleteIncome,
    getCategorySummary,
    getMonthlySummary
} from '../Controllers/incomeController.js';

const router = express.Router();

// @route   GET /api/incomes
// @desc    Get all incomes for a user
// @access  Private
router.get('/', auth, getIncomes);

// @route   POST /api/incomes
// @desc    Create a new income
// @access  Private
router.post('/', auth, createIncome);

// @route   GET /api/incomes/:id
// @desc    Get income by ID
// @access  Private
router.get('/:id', auth, getIncomeById);

// @route   PUT /api/incomes/:id
// @desc    Update an income
// @access  Private
router.put('/:id', auth, updateIncome);

// @route   DELETE /api/incomes/:id
// @desc    Delete an income
// @access  Private
router.delete('/:id', auth, deleteIncome);

// @route   GET /api/incomes/summary/categories
// @desc    Get income summary by categories
// @access  Private
router.get('/summary/categories', auth, getCategorySummary);

// @route   GET /api/incomes/summary/monthly
// @desc    Get monthly income summary
// @access  Private
router.get('/summary/monthly', auth, getMonthlySummary);

export default router;
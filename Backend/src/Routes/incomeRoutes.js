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

// Basic routes
router.get('/', auth, getIncomes);
router.post('/', auth, createIncome);

// Summary routes - THESE MUST COME BEFORE ID ROUTES
router.get('/summary/categories', auth, getCategorySummary);
router.get('/summary/monthly', auth, getMonthlySummary);
router.get('/summary/yearly', auth, getMonthlySummary);

// ID-specific routes - THESE MUST COME LAST
router.get('/:id', auth, getIncomeById);
router.put('/:id', auth, updateIncome);
router.delete('/:id', auth, deleteIncome);

export default router;
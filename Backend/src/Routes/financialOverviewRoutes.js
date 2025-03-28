import express from 'express';
import auth from '../Middleware/auth.js';
import {
    getDashboardSummary,
    getCashFlow,
    getSavingsAnalysis,
    getBudgetPerformance
} from '../Controllers/financialOverviewController.js';

const router = express.Router();

// @route   GET /api/financial/dashboard
// @desc    Get dashboard overview data
// @access  Private
router.get('/dashboard', auth, getDashboardSummary);

// @route   GET /api/financial/cash-flow
// @desc    Get cash flow analysis (income vs expenses over time)
// @access  Private
router.get('/cash-flow', auth, getCashFlow);

// @route   GET /api/financial/savings
// @desc    Get savings analysis
// @access  Private
router.get('/savings', auth, getSavingsAnalysis);

// @route   GET /api/financial/budget-performance
// @desc    Get budget performance overview
// @access  Private
router.get('/budget-performance', auth, getBudgetPerformance);

export default router;
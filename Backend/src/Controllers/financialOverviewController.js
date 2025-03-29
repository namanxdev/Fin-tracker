import Expense from '../Models/ExpenseModel.js';
import Income from '../Models/IncomeModel.js';
import Budget from '../Models/BudgetModel.js';
import { ExpressError } from '../utils/ErrorHandler.js';
import mongoose from 'mongoose';

// @desc    Get dashboard summary data
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Get current month date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Get total income for current month
        const monthlyIncome = await Income.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get total expenses for current month
        const monthlyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get top spending categories
        const topCategories = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);
        
        // Get budget status overview
        const budgets = await Budget.find({ user: userId });
        
        // Prepare response data
        const summary = {
            currentMonth: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
            income: monthlyIncome.length > 0 ? monthlyIncome[0].total : 0,
            expenses: monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0,
            savings: (monthlyIncome.length > 0 ? monthlyIncome[0].total : 0) - 
                    (monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0),
            topCategories,
            budgetCount: budgets.length
        };
        
        res.json(summary);
    } catch (error) {
        console.error(error);
        next(new ExpressError('Failed to get dashboard summary', 500));
    }
};

// @desc    Get cash flow analysis
// @access  Private
export const getCashFlow = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { months = 6 } = req.query;
        
        // Calculate start date (default: 6 months ago)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));
        
        // Get monthly income
        const monthlyIncome = await Income.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' } 
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        // Get monthly expenses
        const monthlyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' } 
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        // Format data for charts
        const cashFlowData = [];
        
        // Create a map of all months in the period
        for (let i = 0; i < parseInt(months); i++) {
            const date = new Date(startDate);
            date.setMonth(startDate.getMonth() + i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            // Find income for this month
            const income = monthlyIncome.find(
                item => item._id.year === year && item._id.month === month
            );
            
            // Find expenses for this month
            const expenses = monthlyExpenses.find(
                item => item._id.year === year && item._id.month === month
            );
            
            cashFlowData.push({
                period: `${date.toLocaleString('default', { month: 'short' })} ${year}`,
                income: income ? income.total : 0,
                expenses: expenses ? expenses.total : 0,
                net: (income ? income.total : 0) - (expenses ? expenses.total : 0)
            });
        }
        
        res.json(cashFlowData);
    } catch (error) {
        console.error(error);
        next(new ExpressError('Failed to get cash flow data', 500));
    }
};

// @desc    Get savings analysis
// @access  Private
export const getSavingsAnalysis = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { months = 12 } = req.query;
        
        // Calculate start date
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));
        
        // Get monthly income vs expenses
        const monthlyIncome = await Income.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' } 
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        const monthlyExpenses = await Expense.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            { 
                $group: { 
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' } 
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        // Calculate savings by month and cumulatively
        let cumulativeSavings = 0;
        const savingsData = [];
        
        for (let i = 0; i < parseInt(months); i++) {
            const date = new Date(startDate);
            date.setMonth(startDate.getMonth() + i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            
            // Find income and expenses for this month
            const income = monthlyIncome.find(
                item => item._id.year === year && item._id.month === month
            );
            const expenses = monthlyExpenses.find(
                item => item._id.year === year && item._id.month === month
            );
            
            // Calculate savings and savings rate
            const monthlySavings = (income ? income.total : 0) - (expenses ? expenses.total : 0);
            const savingsRate = income && income.total > 0 ? 
                (monthlySavings / income.total) * 100 : 0;
            
            // Update cumulative savings
            cumulativeSavings += monthlySavings;
            
            savingsData.push({
                period: `${date.toLocaleString('default', { month: 'short' })} ${year}`,
                monthlySavings,
                savingsRate: parseFloat(savingsRate.toFixed(2)),
                cumulativeSavings
            });
        }
        
        // Calculate average savings rate
        const totalIncome = monthlyIncome.reduce((sum, item) => sum + item.total, 0);
        const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.total, 0);
        const overallSavings = totalIncome - totalExpenses;
        const overallSavingsRate = totalIncome > 0 ? 
            (overallSavings / totalIncome) * 100 : 0;
        
        res.json({
            savingsData,
            summary: {
                averageSavingsRate: parseFloat(overallSavingsRate.toFixed(2)),
                totalSaved: overallSavings,
                totalIncome,
                totalExpenses
            }
        });
    } catch (error) {
        console.error(error);
        next(new ExpressError('Failed to get savings analysis', 500));
    }
};

// @desc    Get budget performance overview
// @access  Private
export const getBudgetPerformance = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Get current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Get all active budgets
        const budgets = await Budget.find({ 
            user: userId
        });
        
        if (!budgets || budgets.length === 0) {
            return res.json({ 
                message: 'No active budgets found',
                budgets: []
            });
        }
        
        // Calculate budget performance for each budget
        const budgetPerformance = await Promise.all(budgets.map(async (budget) => {
            // Get expenses for this category in current month
            const expenses = await Expense.aggregate([
                { 
                    $match: { 
                        user: new mongoose.Types.ObjectId(userId),
                        category: budget.category,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            
            const spent = expenses.length > 0 ? expenses[0].total : 0;
            const remaining = budget.limit - spent;
            const percentUsed = (spent / budget.limit) * 100;
            
            // Calculate status
            let status;
            if (percentUsed > 100) {
                status = 'Exceeded';
            } else if (percentUsed >= 90) {
                status = 'Warning';
            } else if (percentUsed >= 75) {
                status = 'Caution';
            } else {
                status = 'Good';
            }
            
            // Days left in period
            const daysInMonth = endOfMonth.getDate();
            const today = now.getDate();
            const daysLeft = daysInMonth - today;
            
            // Daily budget remaining
            const dailyBudgetRemaining = daysLeft > 0 ? remaining / daysLeft : 0;
            
            return {
                category: budget.category,
                limit: budget.limit,
                spent,
                remaining,
                percentUsed: parseFloat(percentUsed.toFixed(2)),
                status,
                daysLeft,
                dailyBudgetRemaining: parseFloat(dailyBudgetRemaining.toFixed(2))
            };
        }));
        
        // Sort by percentage used (descending)
        budgetPerformance.sort((a, b) => b.percentUsed - a.percentUsed);
        
        res.json(budgetPerformance);
    } catch (error) {
        console.error(error);
        next(new ExpressError('Failed to get budget performance', 500));
    }
};
import React, { useMemo } from 'react';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    PieChart, 
    Calendar,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';

function ExpenseCards() {
    const isDark = useThemeStore(state => state.isDark());
    const expenses = useExpenseStore(state => state.expenses);
    
    // Calculate stats from expenses
    const stats = useMemo(() => {
        // Default values if no data
        const defaultStats = {
            biggestExpense: { title: 'No expenses', amount: 0, date: new Date() },
            topCategory: { name: 'None', amount: 0 },
            monthlyDelta: { 
                amount: 0, 
                isIncrease: false, 
                percentage: 0,
                current: 0,  // Add this property
                previous: 0  // Add this property
            }
        };
        
        if (!expenses || expenses.length === 0) return defaultStats;
        
        // 1. Find biggest single expense
        const biggestExpense = [...expenses].sort((a, b) => 
            parseFloat(b.amount) - parseFloat(a.amount)
        )[0];
        
        // 2. Calculate top category
        const categories = expenses.reduce((acc, exp) => {
            const category = exp.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + parseFloat(exp.amount || 0);
            return acc;
        }, {});
        
        const topCategory = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .map(([name, amount]) => ({ name, amount }))
            [0] || { name: 'None', amount: 0 };
        
        // 3. Calculate month over month change
        const today = new Date();
        const currentMonth = today.getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const currentYear = today.getFullYear();
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        // Current month expenses
        const currentMonthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && 
                   expDate.getFullYear() === currentYear;
        });
        
        // Last month expenses
        const lastMonthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === lastMonth && 
                   expDate.getFullYear() === lastMonthYear;
        });
        
        const currentMonthTotal = currentMonthExpenses.reduce(
            (sum, exp) => sum + parseFloat(exp.amount), 0
        );
        
        const lastMonthTotal = lastMonthExpenses.reduce(
            (sum, exp) => sum + parseFloat(exp.amount), 0
        );
        
        let percentage = 0;
        let isIncrease = false;
        
        if (lastMonthTotal > 0) {
            percentage = Math.round(Math.abs(currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100);
            isIncrease = currentMonthTotal > lastMonthTotal;
        } else if (currentMonthTotal > 0) {
            percentage = 100;
            isIncrease = true;
        }
        
        const monthlyDelta = {
            current: currentMonthTotal,
            previous: lastMonthTotal,
            amount: Math.abs(currentMonthTotal - lastMonthTotal),
            isIncrease,
            percentage
        };
        
        return {
            biggestExpense,
            topCategory,
            monthlyDelta
        };
    }, [expenses]);

    const getCardClass = (theme) => {
        return `card ${theme === 1 ? 
            (isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200') : 
            theme === 2 ? 
            (isDark ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 border-emerald-200') :
            (isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200')
        } shadow-sm border`;
    };
    
    const getTextClass = (theme) => {
        return theme === 1 ? 
            (isDark ? 'text-blue-300' : 'text-blue-600') : 
            theme === 2 ? 
            (isDark ? 'text-emerald-300' : 'text-emerald-600') :
            (isDark ? 'text-amber-300' : 'text-amber-600');
    };
    
    const getIconBgClass = (theme) => {
        return `p-2 rounded-full ${theme === 1 ? 
            (isDark ? 'bg-blue-900/70 text-blue-100' : 'bg-blue-100 text-blue-600') : 
            theme === 2 ? 
            (isDark ? 'bg-emerald-900/70 text-emerald-100' : 'bg-emerald-100 text-emerald-600') :
            (isDark ? 'bg-amber-900/70 text-amber-100' : 'bg-amber-100 text-amber-600')
        }`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Biggest Expense Card */}
            <div className={getCardClass(1)}>
                <div className="card-body p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Largest Expense
                        </h3>
                        <div className={getIconBgClass(1)}>
                            <DollarSign size={18} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            ${parseFloat(stats.biggestExpense.amount || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {stats.biggestExpense.title || 'No title'}
                        </p>
                        <p className={`text-xs ${getTextClass(1)}`}>
                            <Calendar size={14} className="inline mr-1" />
                            {stats.biggestExpense.date ? format(new Date(stats.biggestExpense.date), 'MMM d, yyyy') : 'No date'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Category Card */}
            <div className={getCardClass(2)}>
                <div className="card-body p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Top Category
                        </h3>
                        <div className={getIconBgClass(2)}>
                            <PieChart size={18} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {stats.topCategory.name || 'None'}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            ${parseFloat(stats.topCategory.amount || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <p className={`text-xs ${getTextClass(2)}`}>
                            Highest spending category
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly Change Card */}
            <div className={getCardClass(3)}>
                <div className="card-body p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Monthly Trend
                        </h3>
                        <div className={getIconBgClass(3)}>
                            {stats.monthlyDelta.isIncrease ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            ${(stats.monthlyDelta?.current || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                        <div className="flex items-center">
                            <span className={`text-sm ${
                                stats.monthlyDelta?.isIncrease 
                                    ? 'text-red-500' 
                                    : 'text-green-500'
                            } flex items-center`}>
                                {stats.monthlyDelta?.isIncrease 
                                    ? <ArrowUp size={14} className="mr-1" /> 
                                    : <ArrowDown size={14} className="mr-1" />
                                }
                                {stats.monthlyDelta?.percentage || 0}% 
                            </span>
                            <span className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                from last month
                            </span>
                        </div>
                        <p className={`text-xs ${getTextClass(3)}`}>
                            Previous: ${(stats.monthlyDelta?.previous || 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseCards;
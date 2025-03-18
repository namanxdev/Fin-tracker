import React, { useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore'; // Add this import
import { format, parseISO } from 'date-fns';

function ExpenseAreaChart() {
    // Get theme state
    const isDark = useThemeStore(state => state.isDark());
    
    const expenses = useExpenseStore(state => state.expenses);
    const getExpenses = useExpenseStore(state => state.getExpenses);
    const isLoading = useExpenseStore(state => state.isLoading);
    const getTotalExpenses = useExpenseStore(state => state.selectors.getTotalExpenses);
    
    const [chartData, setChartData] = useState([]);
    
    useEffect(() => {
        getExpenses();
    }, [getExpenses]);
    
    // Replace your current data processing with this more robust version
    const processChartData = useCallback(() => {
        if (!expenses || expenses.length === 0) {
            setChartData([]);
            return;
        }
        
        try {
            // Group expenses by date and calculate total amount per date
            const groupedByDate = expenses.reduce((acc, expense) => {
                // Handle potential null/undefined values safely
                const dateStr = expense.date || '';
                const dateKey = dateStr.split('T')[0];
                if (!dateKey) return acc;
                
                const amount = parseFloat(expense.amount || 0);
                
                if (!acc[dateKey]) {
                    acc[dateKey] = 0;
                }
                acc[dateKey] += amount;
                return acc;
            }, {});
            
            // Convert to array format needed for Recharts
            const formattedData = Object.entries(groupedByDate)
                .map(([date, amount]) => {
                    try {
                        return {
                            date,
                            amount: parseFloat(amount.toFixed(2)),
                            name: format(parseISO(date), 'MMM d')
                        };
                    } catch (err) {
                        console.error("Error formatting date:", date, err);
                        return {
                            date, 
                            amount: parseFloat(amount.toFixed(2)),
                            name: date // Fallback if date parsing fails
                        };
                    }
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            console.log("Chart data:", formattedData); // Debug
            setChartData(formattedData);
        } catch (err) {
            console.error("Error processing chart data:", err);
            setChartData([]);
        }
    }, [expenses]);
    
    // Call the processing function when expenses change
    useEffect(() => {
        processChartData();
    }, [processChartData]);
    
    // Create custom tooltip styles based on theme
    const tooltipStyles = {
        contentStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        labelStyle: {
            color: isDark ? '#d1d5db' : '#374151',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
        },
        itemStyle: {
            color: isDark ? '#f3f4f6' : '#111827',
        },
    };
    
    // Custom tooltip formatter function
    const formatTooltipValue = (value, name) => {
        return [`$${value}`, 'Expenses'];
    };
    
    return (
        <div>
            <div className={`container ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                {isLoading ? (
                    <div className={`flex justify-center items-center h-64 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Loading expenses data...
                    </div>
                ) : (
                    <>
                        {/* Expense Area chart */}
                        <div style={{ width: '100%', height: 350 }}>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer>
                                    <AreaChart 
                                        data={chartData}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis 
                                            dataKey="name" 
                                            stroke={isDark ? "#9ca3af" : "#6b7280"} 
                                        />
                                        <YAxis 
                                            stroke={isDark ? "#9ca3af" : "#6b7280"}
                                        />
                                        <CartesianGrid 
                                            strokeDasharray="3 3" 
                                            stroke={isDark ? "#374151" : "#e5e7eb"} 
                                        />
                                        <Tooltip 
                                            formatter={formatTooltipValue}
                                            contentStyle={tooltipStyles.contentStyle}
                                            labelStyle={tooltipStyles.labelStyle}
                                            itemStyle={tooltipStyles.itemStyle}
                                            cursor={{ stroke: isDark ? '#6b7280' : '#9ca3af', strokeWidth: 1 }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#dc2626" 
                                            fillOpacity={1} 
                                            fill="url(#colorExpenses)" 
                                            name="Expenses"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className={`flex justify-center items-center h-full rounded-lg
                                    ${isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                    <p>No expense data to display</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Display total expenses */}
                        <div className={`stats-summary text-center mt-4 font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            <h3>Total Expenses: ${getTotalExpenses()}</h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ExpenseAreaChart;
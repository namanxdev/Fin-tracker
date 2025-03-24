import React, { useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import useThemeStore from '../../store/themeStore';
import { subMonths, format } from 'date-fns';

function BudgetTrendChart({ budgets, budgetStatuses, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Generate trend data over last 6 months or periods
    const trendData = useMemo(() => {
        // Get current date and calculate past 6 months/periods
        const today = new Date();
        const periods = [];
        
        // Generate period labels based on selectedPeriod
        for (let i = 5; i >= 0; i--) {
            let periodLabel;
            let periodStart;
            
            switch (selectedPeriod) {
                case 'monthly':
                    periodStart = subMonths(today, i);
                    periodLabel = format(periodStart, 'MMM yyyy');
                    break;
                case 'quarterly':
                    // Get current quarter minus i
                    const currentQuarter = Math.floor(today.getMonth() / 3);
                    const quarterDiff = i % 4;
                    const yearDiff = Math.floor(i / 4);
                    const quarter = (currentQuarter - quarterDiff + 4) % 4;
                    const year = today.getFullYear() - yearDiff;
                    periodLabel = `Q${quarter + 1} ${year}`;
                    break;
                case 'yearly':
                    periodLabel = `${today.getFullYear() - i}`;
                    break;
                default:
                    // For daily/weekly just show relative labels
                    periodLabel = i === 0 ? 'Current' : `${i} ${selectedPeriod} ago`;
            }
            
            periods.push({
                period: periodLabel,
                date: periodStart || new Date(), // Fallback if not monthly
                budgetTotal: 0,
                spentTotal: 0,
                categories: {}
            });
        }
        
        // Simulate data collection for trend
        // In a real app, you would get this from your API
        
        // Filter budgets for the selected period
        const relevantBudgets = budgets.filter(b => b.period === selectedPeriod);
        
        // Set some simulated trend data
        // Note: In a real app, you would pull actual historical data
        periods.forEach((periodData, index) => {
            let budgetTotal = 0;
            
            // Each category has a slightly different budget and spending pattern
            relevantBudgets.forEach(budget => {
                const baseAmount = budget.limit;
                // Budget stays relatively constant
                const budgetAmount = baseAmount;
                
                // Spending varies over time based on a pattern
                // (higher at beginning, lower in middle, higher at end for demo)
                const patternMultiplier = index < 2 ? 0.8 + (index * 0.1) : 
                                          index < 4 ? 0.7 + ((index - 2) * 0.15) : 
                                          0.9 + ((index - 4) * 0.15);
                const spentAmount = Math.round(baseAmount * patternMultiplier);
                
                // Add to total
                budgetTotal += budgetAmount;
                
                // Store both category-specific and total data
                periodData.categories[budget.category] = {
                    budget: budgetAmount,
                    spent: spentAmount,
                };
            });
            
            // Set the totals
            periodData.budgetTotal = budgetTotal;
            periodData.spentTotal = Object.values(periodData.categories)
                .reduce((sum, cat) => sum + cat.spent, 0);
        });
        
        // For the current period, use actual data from budgetStatuses
        if (periods.length > 0 && budgetStatuses.length > 0) {
            const currentPeriod = periods[periods.length - 1];
            
            // Calculate actual spent total from statuses
            const actualSpentTotal = budgetStatuses.reduce((total, status) => {
                return total + (status.totalSpent || 0);
            }, 0);
            
            // Update the current period with actual data
            currentPeriod.spentTotal = actualSpentTotal;
            
            // Update category-specific data for the current period
            budgetStatuses.forEach(status => {
                if (currentPeriod.categories[status.category]) {
                    currentPeriod.categories[status.category].spent = status.totalSpent || 0;
                }
            });
        }
        
        return periods;
    }, [budgets, budgetStatuses, selectedPeriod]);
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const budgetValue = payload[0]?.value || 0;
            const spentValue = payload[1]?.value || 0;
            const difference = budgetValue - spentValue;
            const isOverBudget = difference < 0;
            
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <p className="font-bold mb-1">{label}</p>
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-2"></span>
                        Budget: ${budgetValue.toLocaleString()}
                    </p>
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mr-2"></span>
                        Spent: ${spentValue.toLocaleString()}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                        {isOverBudget 
                            ? `Over Budget: $${Math.abs(difference).toLocaleString()}` 
                            : `Under Budget: $${difference.toLocaleString()}`}
                    </p>
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Budget vs Spending Trends</h3>
            
            {trendData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        No trend data available
                    </p>
                </div>
            ) : (
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={trendData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
                            <XAxis 
                                dataKey="period" 
                                stroke={isDark ? '#ccc' : '#666'} 
                            />
                            <YAxis 
                                stroke={isDark ? '#ccc' : '#666'}
                                tickFormatter={(value) => `$${value}`} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            
                            {/* Reference line where budget equals spending */}
                            <ReferenceLine 
                                stroke={isDark ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.8)'} 
                                strokeDasharray="3 3"
                                strokeWidth={2}
                                ifOverflow="extendDomain"
                                label={{
                                    value: "Budget = Spending",
                                    fill: isDark ? '#999' : '#888',
                                    fontSize: 12
                                }}
                            />
                            
                            <Line 
                                type="monotone" 
                                dataKey="budgetTotal" 
                                name="Budget" 
                                stroke="#f97316"  // Replace gradient with solid color for testing
                                strokeWidth={3}
                                dot={{ stroke: '#f97316', strokeWidth: 2, r: 4, fill: isDark ? '#1f2937' : 'white' }}
                                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: 'white' }}
                                isAnimationActive={false} // Disable animation to see if that's an issue
                            />
                            <Line 
                                type="monotone" 
                                dataKey="spentTotal" 
                                name="Spent" 
                                stroke="#a855f7"  // Replace gradient with solid color for testing
                                strokeWidth={3}
                                dot={{ stroke: '#a855f7', strokeWidth: 2, r: 4, fill: isDark ? '#1f2937' : 'white' }}
                                activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2, fill: 'white' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            <div className="mt-4 px-4">
                <p className="text-sm text-gray-500">
                    This chart shows your budget vs. actual spending trends over time. 
                    The orange line represents your total budget, while the purple line shows your actual spending.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Ideally, the purple line (spending) should stay below the orange line (budget).
                </p>
            </div>
        </div>
    );
}

export default BudgetTrendChart;
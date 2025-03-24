import React, { useMemo } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import useThemeStore from '../../store/themeStore';

// Get period name based on type and value
const getPeriodName = (type, value) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch(type) {
        case 'monthly':
            return months[value - 1];
        case 'quarterly':
            return `Q${value}`;
        case 'yearly':
            return value.toString();
        default:
            return value.toString();
    }
};

function BudgetPeriodChart({ budgets, budgetStatuses, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Generate comparison data across periods
    const periodData = useMemo(() => {
        // Generate different comparison data based on the selected period
        const relevantBudgets = budgets.filter(b => b.period === selectedPeriod);
        if (!relevantBudgets.length) return [];
        
        // Group budgets by category
        const categoryBudgets = {};
        relevantBudgets.forEach(budget => {
            if (!categoryBudgets[budget.category]) {
                categoryBudgets[budget.category] = {
                    category: budget.category,
                    limit: budget.limit,
                    color: budget.color || '#f97316'
                };
            }
        });
        
        // Generate comparison data
        const periods = [];
        const now = new Date();
        
        switch(selectedPeriod) {
            case 'monthly':
                // Compare last 6 months
                for (let i = 5; i >= 0; i--) {
                    const monthIndex = ((now.getMonth() - i) + 12) % 12;
                    const monthNum = monthIndex + 1;
                    periods.push({
                        period: getPeriodName('monthly', monthNum),
                        periodType: 'monthly',
                        periodValue: monthNum,
                        categories: { ...categoryBudgets },
                        totalBudget: 0,
                        totalSpent: 0,
                        percentUsed: 0
                    });
                }
                break;
                
            case 'quarterly':
                // Compare last 4 quarters
                const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
                for (let i = 3; i >= 0; i--) {
                    const quarterNum = ((currentQuarter - i) + 4) % 4 || 4;
                    periods.push({
                        period: getPeriodName('quarterly', quarterNum),
                        periodType: 'quarterly',
                        periodValue: quarterNum,
                        categories: { ...categoryBudgets },
                        totalBudget: 0,
                        totalSpent: 0,
                        percentUsed: 0
                    });
                }
                break;
                
            case 'yearly':
                // Compare last 3 years
                const currentYear = now.getFullYear();
                for (let i = 2; i >= 0; i--) {
                    const year = currentYear - i;
                    periods.push({
                        period: year.toString(),
                        periodType: 'yearly',
                        periodValue: year,
                        categories: { ...categoryBudgets },
                        totalBudget: 0,
                        totalSpent: 0,
                        percentUsed: 0
                    });
                }
                break;
                
            default:
                // For daily/weekly, just use dummy periods
                for (let i = 0; i < 6; i++) {
                    periods.push({
                        period: `Period ${i+1}`,
                        periodType: selectedPeriod,
                        periodValue: i+1,
                        categories: { ...categoryBudgets },
                        totalBudget: 0,
                        totalSpent: 0,
                        percentUsed: 0
                    });
                }
        }
        
        // Fill with simulated data
        // (In a real app, you would fetch historical data from your API)
        periods.forEach(period => {
            let totalBudget = 0;
            let totalSpent = 0;
            
            // For each category, simulate budget utilization
            // with slightly different patterns for each period
            Object.keys(period.categories).forEach(cat => {
                const budget = period.categories[cat];
                
                // Base budget amount
                const budgetAmount = budget.limit;
                
                // Randomized spending amount influenced by period
                // (creates a pattern across periods)
                let spendingRatio;
                
                // Different spending patterns based on category types (for demo)
                if (cat.toLowerCase().includes('food') || cat.toLowerCase().includes('groceries')) {
                    // Food spending tends to be consistent
                    spendingRatio = 0.85 + (Math.random() * 0.3);
                } else if (cat.toLowerCase().includes('entertainment') || cat.toLowerCase().includes('travel')) {
                    // Entertainment/travel fluctuates more by period
                    const periodFactor = (period.periodValue % 3) * 0.25;
                    spendingRatio = 0.5 + periodFactor + (Math.random() * 0.4);
                } else {
                    // Other categories have moderate fluctuations
                    spendingRatio = 0.7 + (Math.random() * 0.5);
                }
                
                const spentAmount = Math.round(budgetAmount * spendingRatio);
                
                // Update category data
                period.categories[cat] = {
                    ...budget,
                    spent: spentAmount,
                    percentUsed: (spentAmount / budgetAmount) * 100
                };
                
                // Add to totals
                totalBudget += budgetAmount;
                totalSpent += spentAmount;
            });
            
            // Update period totals
            period.totalBudget = totalBudget;
            period.totalSpent = totalSpent;
            period.percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
        });
        
        return periods;
    }, [budgets, budgetStatuses, selectedPeriod]);
    
    // Prepare data for the chart
    const chartData = useMemo(() => {
        if (!periodData.length) return [];
        
        return periodData.map(period => {
            const formattedData = {
                name: period.period,
                budgetTotal: period.totalBudget,
                spentTotal: period.totalSpent,
                utilization: period.percentUsed,
                isOverBudget: period.totalSpent > period.totalBudget
            };
            
            // Add category-specific data
            Object.entries(period.categories).forEach(([category, data]) => {
                formattedData[`${category}_budget`] = data.limit;
                formattedData[`${category}_spent`] = data.spent;
            });
            
            return formattedData;
        });
    }, [periodData]);
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Group payload items by category
            const categories = {};
            const totals = { budget: 0, spent: 0 };
            
            payload.forEach(item => {
                const key = item.dataKey;
                
                if (key === 'budgetTotal') {
                    totals.budget = item.value;
                } else if (key === 'spentTotal') {
                    totals.spent = item.value;
                } else if (key.includes('_budget')) {
                    const category = key.split('_')[0];
                    if (!categories[category]) categories[category] = {};
                    categories[category].budget = item.value;
                } else if (key.includes('_spent')) {
                    const category = key.split('_')[0];
                    if (!categories[category]) categories[category] = {};
                    categories[category].spent = item.value;
                }
            });
            
            const isOverBudget = totals.spent > totals.budget;
            
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <p className="font-bold mb-2">{label}</p>
                    <div className="mb-2">
                        <p className="text-sm font-semibold">Totals:</p>
                        <p className="text-sm">Budget: ${totals.budget.toLocaleString()}</p>
                        <p className="text-sm">Spent: ${totals.spent.toLocaleString()}</p>
                        <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                            {isOverBudget 
                                ? `Over Budget: $${(totals.spent - totals.budget).toLocaleString()}`
                                : `Under Budget: $${(totals.budget - totals.spent).toLocaleString()}`}
                        </p>
                    </div>
                    
                    {Object.entries(categories).length > 0 && (
                        <div>
                            <p className="text-sm font-semibold">By Category:</p>
                            {Object.entries(categories).map(([category, data]) => (
                                <div key={category} className="text-xs mt-1">
                                    <p className="font-medium">{category}</p>
                                    <p>Budget: ${data.budget?.toLocaleString() || 0}</p>
                                    <p>Spent: ${data.spent?.toLocaleString() || 0}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Budget Comparison by Period</h3>
            
            {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        No period comparison data available
                    </p>
                </div>
            ) : (
                <div className="h-110">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
                            <XAxis dataKey="name" stroke={isDark ? '#ccc' : '#666'} />
                            <YAxis 
                                yAxisId="left"
                                orientation="left"
                                stroke={isDark ? '#ccc' : '#666'} 
                                tickFormatter={(value) => `$${value}`}
                            />
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                stroke={isDark ? '#ccc' : '#666'} 
                                tickFormatter={(value) => `${value}%`}
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            
                            <ReferenceLine 
                                yAxisId="right" 
                                y={100} 
                                label="100%" 
                                stroke={isDark ? "rgba(255, 100, 100, 0.5)" : "rgba(255, 50, 50, 0.3)"} 
                                strokeDasharray="3 3" 
                            />
                            
                            <defs>
                                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.4}/>
                                </linearGradient>
                                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4}/>
                                </linearGradient>
                                <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.4}/>
                                </linearGradient>
                            </defs>
                            
                            <Bar 
                                yAxisId="left"
                                dataKey="budgetTotal" 
                                name="Budget" 
                                fill="url(#budgetGradient)" 
                                radius={[4, 4, 0, 0]} 
                            />
                            <Bar 
                                yAxisId="left"
                                dataKey="spentTotal" 
                                name="Spent" 
                                fill="url(#spentGradient)" 
                                radius={[4, 4, 0, 0]} 
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="utilization"
                                name="Utilization %"
                                fill="url(#utilizationGradient)"
                                radius={[4, 4, 0, 0]}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.isOverBudget ? '#ef4444' : '#22c55e'} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            <div className="mt-4 px-4">
                <p className="text-sm text-gray-500">
                    This chart compares your budgets and spending across different {selectedPeriod} periods. 
                    The green/red bars show the utilization percentage for each period.
                </p>
            </div>
        </div>
    );
}

export default BudgetPeriodChart;
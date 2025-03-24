import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import useThemeStore from '../../store/themeStore';

function BudgetOverview({ budgets, budgetStatuses, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Prepare data for chart
    const chartData = budgets
        .filter(budget => budget.period === selectedPeriod)
        .map(budget => {
            const status = budgetStatuses.find(s => s.category === budget.category);
            // console.log(status);    
            return {
                category: budget.category,
                budget: budget.limit,
                spent: status ? status.totalSpent : 0
            };
        });
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <p className="font-bold">{label}</p>
                    <p className="text-sm">Budget: ${payload[0].value.toLocaleString()}</p>
                    <p className="text-sm">Spent: ${payload[1].value.toLocaleString()}</p>
                    <p className="text-sm font-semibold">
                        {payload[1].value > payload[0].value 
                            ? `Over budget by $${(payload[1].value - payload[0].value).toLocaleString()}` 
                            : `Under budget by $${(payload[0].value - payload[1].value).toLocaleString()}`
                        }
                    </p>
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-500">Budget vs Spending</h3>
            
            {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        No budget data available for the selected period
                    </p>
                </div>
            ) : (
                <div className="h-110">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
                            <XAxis 
                                dataKey="category" 
                                angle={-45} 
                                textAnchor="end" 
                                height={70}
                                stroke={isDark ? '#ccc' : '#666'} 
                            />
                            <YAxis 
                                stroke={isDark ? '#ccc' : '#666'}
                                tickFormatter={(value) => `$${value}`} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <defs>
                                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.4}/>
                                </linearGradient>
                                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4}/>
                                </linearGradient>
                            </defs>
                            <Bar 
                                dataKey="budget" 
                                name="Budget" 
                                fill="url(#budgetGradient)" 
                                radius={[4, 4, 0, 0]} 
                            />
                            <Bar 
                                dataKey="spent" 
                                name="Spent" 
                                fill="url(#spentGradient)" 
                                radius={[4, 4, 0, 0]} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default BudgetOverview;
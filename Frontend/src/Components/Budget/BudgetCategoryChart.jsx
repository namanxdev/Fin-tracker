import React from 'react';
import useThemeStore from '../../store/themeStore';
import { 
    ResponsiveContainer, 
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip 
} from 'recharts';
import { getCategoryColor } from '../Theme/ThemeIcons';

function BudgetCategoryChart({ budgets, budgetStatuses, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Format data for pie chart
    const chartData = budgets
        .filter(budget => budget.period === selectedPeriod)
        .map((budget) => {
            const status = budgetStatuses.find(s => s.category === budget.category);
            const spent = status ? status.totalSpent : 0;
            const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
            
            return {
                name: budget.category,
                value: spent, // Use actual spending amount for pie size
                percentage: percentage,
                limit: budget.limit,
                actualSpent: spent,
                fill: getCategoryColor(budget.category)
            };
        })
        .filter(item => item.value > 0) // Only show categories with spending
        .sort((a, b) => b.value - a.value); // Sort by value descending
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'
                }`}>
                    <p className="font-bold mb-1">{data.name}</p>
                    <div className="grid grid-cols-2 gap-x-3 text-sm">
                        <p className="text-gray-500 dark:text-gray-400">Budget:</p>
                        <p className="font-medium">${data.limit.toLocaleString()}</p>
                        
                        <p className="text-gray-500 dark:text-gray-400">Spent:</p>
                        <p className="font-medium">${data.actualSpent.toLocaleString()}</p>
                        
                        <p className="text-gray-500 dark:text-gray-400">Usage:</p>
                        <p className={`font-medium ${
                            data.percentage > 100 ? 'text-red-500' : 
                            data.percentage > 80 ? 'text-amber-500' : 
                            'text-emerald-500'
                        }`}>
                            {data.percentage.toFixed(1)}%
                        </p>
                    </div>
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className={`p-6 rounded-lg shadow-md h-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-500">
                Budget Spending by Category
            </h3>
            
            {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        No spending data available for the selected period
                    </p>
                </div>
            ) : (
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius="45%"
                                outerRadius="70%"
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.fill} 
                                        stroke={isDark ? '#222' : '#fff'}
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            {/* Category tags with percentage indicators */}
            {chartData.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {chartData.map((item, index) => (
                        <div 
                            key={`cat-${index}`}
                            className={`flex items-center px-2.5 py-1 rounded-full text-xs ${
                                isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                        >
                            <div 
                                className="w-2.5 h-2.5 rounded-full mr-1.5"
                                style={{ backgroundColor: item.fill }}
                            ></div>
                            <span className="font-medium">
                                {item.name}
                            </span>
                            <span className={`ml-1.5 ${
                                item.percentage > 100 ? 'text-red-500' : 
                                item.percentage > 80 ? 'text-amber-500' : 
                                'text-emerald-500'
                            }`}>
                                ${item.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BudgetCategoryChart;
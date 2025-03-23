import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useIncomeStore from '../../store/incomeStore';
import useThemeStore from '../../store/themeStore';

function IncomePieChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getCategorySummary } = useIncomeStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Define colors for each category - using similar colors as expenses but with a different palette
    const COLORS = [
        '#3b82f6', // blue - Salary
        '#8b5cf6', // purple - Freelance
        '#10b981', // emerald - Investment
        '#f59e0b', // amber - Business
        '#ec4899', // pink - Gift
        '#06b6d4', // cyan - Refund
        '#6b7280', // gray - Other
    ];
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await getCategorySummary();
                // console.log("Category Summary Result:", result);
                if (result && result.categorySummary) {
                    
                    const chartData = result.categorySummary.map(item => ({
                        name: item._id || 'Uncategorized',  
                        value: parseFloat(parseFloat(item.total || 0).toFixed(2))
                    }));
                    
                    setChartData(chartData);
                } else {
                    setChartData([]);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching category data:", err);
                setError("Failed to load category data");
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getCategorySummary]);
    
    // Custom tooltip matching ExpensesPieChart style
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            // console.log(payload)
            // console.log(item);
            
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm">
                        ${item.value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    // Custom legend with percentages (matching ExpensesPieChart)
    const renderCustomizedLegend = (props) => {
        const { payload } = props;
        
        return (
            <ul className={`flex flex-wrap justify-center gap-4 mt-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
                {payload.map((entry, index) => {
                    const percent = Number(entry.payload.percent * 100).toFixed(1);
                    const color = entry.color;
                    
                    return (
                        <li key={`item-${index}`} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: color }}
                            />
                            <span>{entry.value} : {percent}%</span>
                        </li>
                    );
                })}
            </ul>
        );
    };
    
    if (isLoading) {
        return (
            <div className={`p-4 rounded-lg shadow-md h-80 flex items-center justify-center ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
                <span className="loading loading-ring loading-lg"></span>

            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`p-4 rounded-lg shadow-md h-80 flex items-center justify-center ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    
    if (chartData.length === 0) {
        return (
            <div className={`p-4 rounded-lg shadow-md h-80 flex items-center justify-center ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    No income category data available
                </p>
            </div>
        );
    }
    
    return (
        <div className={`rounded-lg p-4 shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-semibold mb-4 text-center">Income by Category</h2>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            content={renderCustomizedLegend}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default IncomePieChart;
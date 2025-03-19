import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';

function YearlySummaryChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getYearlySummary } = useExpenseStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getYearlySummary();
                
                // Transform the data for the chart
                const transformedData = data.map(item => ({
                    name: item._id.year.toString(),
                    amount: parseFloat(item.total.toFixed(2)),
                    count: item.count
                })).sort((a, b) => a.name.localeCompare(b.name)); // Sort by year
                
                setChartData(transformedData);
            } catch (err) {
                console.error("Error fetching yearly data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getYearlySummary]);
    
    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-lg shadow ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="font-semibold">Year: {payload[0].payload.name}</p>
                    <p>
                        Total: ${payload[0].value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                    <p>Number of Expenses: {payload[0].payload.count}</p>
                </div>
            );
        }
        return null;
    };
    
    if (isLoading) {
        return (
            <div className={`rounded-lg p-6 shadow-md flex justify-center items-center h-80 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
                <p>Loading yearly expense data...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`rounded-lg p-6 shadow-md flex justify-center items-center h-80 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }
    
    if (chartData.length === 0) {
        return (
            <div className={`rounded-lg p-6 shadow-md flex justify-center items-center h-80 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
                <p>No yearly expense data available.</p>
            </div>
        );
    }
    
    return (
        <div className={`rounded-lg p-6 shadow-md ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
            <h2 className="text-xl font-semibold mb-6">Yearly Expense Summary</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={isDark ? "#374151" : "#e5e7eb"} 
                        />
                        <XAxis 
                            dataKey="name" 
                            stroke={isDark ? "#9ca3af" : "#4b5563"} 
                        />
                        <YAxis 
                            width={65} // Add width to ensure enough space for the currency symbol
                            stroke={isDark ? "#9ca3af" : "#4b5563"}
                            tickFormatter={(value) => {
                                // Safer formatting with error handling
                                if (typeof value !== 'number') return '$0';
                                return `$${value.toLocaleString('en-US', {
                                    maximumFractionDigits: 0 // Remove decimal places to save space
                                })}`;
                            }} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                            dataKey="amount" 
                            name="Yearly Expenses" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default YearlySummaryChart;
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';
import { format } from 'date-fns';

function MonthlySummaryChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getMonthlySummary } = useExpenseStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getMonthlySummary();
                
                // Transform the data for the chart
                const transformedData = data.map(item => {
                    const month = item._id.month;
                    const year = item._id.year;
                    const monthName = format(new Date(year, month - 1), 'MMM yyyy');
                    
                    return {
                        name: monthName,
                        amount: parseFloat(item.total.toFixed(2))
                    };
                }).sort((a, b) => {
                    // Sort by date
                    const dateA = new Date(a.name);
                    const dateB = new Date(b.name);
                    return dateA - dateB;
                });
                
                setChartData(transformedData);
            } catch (err) {
                console.error("Error fetching monthly data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getMonthlySummary]);
    
    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-lg shadow ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="font-semibold">{label}</p>
                    <p>
                        Total: ${payload[0].value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
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
                <p>Loading monthly expense data...</p>
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
                <p>No monthly expense data available.</p>
            </div>
        );
    }
    
    return (
        <div className={`rounded-lg p-6 shadow-md ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
            <h2 className="text-xl font-semibold mb-6">Monthly Expense Summary</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={isDark ? "#374151" : "#e5e7eb"} 
                        />
                        <XAxis 
                            dataKey="name" 
                            stroke={isDark ? "#9ca3af" : "#4b5563"} 
                        />
                        <YAxis 
                            width={65}
                            stroke={isDark ? "#9ca3af" : "#4b5563"}
                            tickFormatter={(value) => `$${value.toLocaleString()}`} 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            name="Monthly Expenses"
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorExpense)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default MonthlySummaryChart;
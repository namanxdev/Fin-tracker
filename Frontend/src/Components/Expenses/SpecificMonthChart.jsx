import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';
import { format } from 'date-fns';

// Colors for the pie segments
const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#94a3b8'];

function SpecificMonthChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getMonthExpenses } = useExpenseStore();
    
    // State
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    
    // Current date for default selection
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState({
        year: now.getFullYear(),
        month: now.getMonth() + 1 // JavaScript months are 0-indexed
    });
    
    // When month/year selection changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await getMonthExpenses(selectedMonth.year, selectedMonth.month);
                
                if (data.byCategory && Array.isArray(data.byCategory)) {
                    // Transform category data for the chart
                    const transformedData = data.byCategory.map(item => ({
                        name: item._id || 'Uncategorized',
                        value: parseFloat(item.total.toFixed(2))
                    }));
                    
                    setChartData(transformedData);
                    setTotalAmount(data.totalAmount);
                } else {
                    setChartData([]);
                    setTotalAmount(0);
                }
            } catch (err) {
                console.error("Error fetching month data:", err);
                setError(err.message);
                setChartData([]);
                setTotalAmount(0);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getMonthExpenses, selectedMonth]);
    
    // Month options for the selector
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];
    
    // Generate year options (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 0; i <= 4; i++) {
        yearOptions.push(currentYear - i);
    }
    
    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = ((data.value / totalAmount) * 100).toFixed(1);
            
            return (
                <div className={`p-3 rounded-lg shadow ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="font-semibold">{data.name}</p>
                    <p>
                        ${data.value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                    <p>{percentage}% of total</p>
                </div>
            );
        }
        return null;
    };
    
    // Custom legend
    const CustomLegend = ({ payload }) => {
        return (
            <ul className={`flex flex-wrap justify-center gap-2 text-sm mt-4 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-1">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span>
                            {entry.value}: 
                            {((entry.payload.value / totalAmount) * 100).toFixed(1)}%
                        </span>
                    </li>
                ))}
            </ul>
        );
    };
    
    return (
        <div className={`rounded-lg p-6 shadow-md ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl font-semibold mb-2 md:mb-0">Monthly Expense Breakdown</h2>
                
                <div className="flex gap-2">
                    <select
                        value={selectedMonth.month}
                        onChange={(e) => setSelectedMonth(prev => ({ 
                            ...prev, 
                            month: parseInt(e.target.value) 
                        }))}
                        className="select select-sm select-bordered"
                    >
                        {monthOptions.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={selectedMonth.year}
                        onChange={(e) => setSelectedMonth(prev => ({ 
                            ...prev, 
                            year: parseInt(e.target.value) 
                        }))}
                        className="select select-sm select-bordered"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading data...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">No data available for {monthOptions.find(m => m.value === selectedMonth.month).label} {selectedMonth.year}</p>
                </div>
            ) : chartData.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p>No expense data for {monthOptions.find(m => m.value === selectedMonth.month).label} {selectedMonth.year}</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-4">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            Total Expenses for {monthOptions.find(m => m.value === selectedMonth.month).label} {selectedMonth.year}
                        </p>
                        <p className="text-2xl font-bold">
                            ${totalAmount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                    
                    <div className="h-64">
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
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}

export default SpecificMonthChart;
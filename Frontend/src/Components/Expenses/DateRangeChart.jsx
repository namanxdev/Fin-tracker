import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import useExpenseStore from '../../store/expenseStore';
import useThemeStore from '../../store/themeStore';

function DateRangeChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getDateRangeExpenses } = useExpenseStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Date range state
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    
    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        try {
            const { startDate, endDate } = dateRange;
            const result = await getDateRangeExpenses(startDate, endDate);
            
            // Process data for chart - group by date
            const expensesByDate = {};
            result.expenses.forEach(expense => {
            const date = expense.date.substring(0, 10); // YYYY-MM-DD
            
            if (!expensesByDate[date]) {
                expensesByDate[date] = { 
                date,
                amount: 0 
                };
            }
            expensesByDate[date].amount += expense.amount;
            });
            
            // Convert to array and sort by date
            const data = Object.values(expensesByDate).sort((a, b) => 
            a.date.localeCompare(b.date)
            );
            
            setChartData(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching date range data:", err);
            setError("Failed to load expense data");
        } finally {
            setIsLoading(false);
        }
        };
        
        fetchData();
    }, [getDateRangeExpenses, dateRange]);
    
    // Handle date range changes with validation
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        
        // Create a copy of the current date range
        const newDateRange = { ...dateRange };
        
        // Update the specific date field that changed
        newDateRange[name] = value;
        
        // Get date objects for comparison
        const startDateObj = new Date(newDateRange.startDate);
        const endDateObj = new Date(newDateRange.endDate);
        
        // Validate that start date is not after end date
        if (startDateObj > endDateObj) {
            // If updating start date to be after end date, set end date to match start date
            if (name === 'startDate') {
                newDateRange.endDate = value;
            }
            // If updating end date to be before start date, set start date to match end date
            else if (name === 'endDate') {
                newDateRange.startDate = value;
            }
            throw new Error("Start date cannot be after end date");
        }
        
        // Update state with valid date range
        setDateRange(newDateRange);
    };
    
    // Update the formatXAxis function to explicitly show "Invalid date"
    const formatXAxis = (tickItem) => {
        try {
            // Validate that the string is a proper date
            const date = parseISO(tickItem);
            // Check if date is invalid
            if (isNaN(date.getTime())) {
                return "Invalid";
            }
            return format(date, 'MM/dd');
        } catch (e) {
            return "Invalid";
        }
    };

    // Update the CustomTooltip function to explicitly show "Invalid date"
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            try {
                const date = parseISO(label);
                // Check if parsed date is valid
                if (isNaN(date.getTime())) {
                    return (
                        <div className={`p-3 rounded-md shadow-md ${
                            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}>
                            <p className="font-bold">Invalid date</p>
                            <p className="text-sm">
                                ${payload[0].value.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                        </div>
                    );
                }
                
                return (
                    <div className={`p-3 rounded-md shadow-md ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <p className="font-bold">{format(date, 'MMMM d, yyyy')}</p>
                        <p className="text-sm">
                            ${payload[0].value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                );
            } catch (e) {
                // If date parsing fails, show fallback tooltip
                return (
                    <div className={`p-3 rounded-md shadow-md ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <p className="font-bold">Invalid date</p>
                        <p className="text-sm">
                            ${payload[0].value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                );
            }
        }
        return null;
    };
    
    return (
        <div className={`p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Expenses by Date Range</h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
            <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className={`input input-bordered ${isDark ? 'bg-gray-700' : ''}`}
                />
            </div>
            <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className={`input input-bordered ${isDark ? 'bg-gray-700' : ''}`}
                />
            </div>
            </div>
        </div>
        
        {isLoading ? (
            <div className="h-64 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
            </div>
        ) : error ? (
            <div className="h-64 flex items-center justify-center text-red-500">
            {error}
            </div>
        ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
            No expense data available for the selected date range
            </div>
        ) : (
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
                <XAxis 
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    stroke={isDark ? '#ccc' : '#666'} 
                />
                <YAxis 
                    stroke={isDark ? '#ccc' : '#666'}
                    tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    fill="url(#colorGradient)" 
                    activeDot={{ r: 8 }} 
                />
                <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                </defs>
                </AreaChart>
            </ResponsiveContainer>
            </div>
        )}
        </div>
    );
}

export default DateRangeChart;
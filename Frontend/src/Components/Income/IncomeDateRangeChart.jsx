import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, isValid } from 'date-fns';
import useIncomeStore from '../../store/incomeStore';
import useThemeStore from '../../store/themeStore';

function IncomeDateRangeChart() {
    const isDark = useThemeStore(state => state.isDark());
    const { getIncomes } = useIncomeStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Date range state
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    
    // Handle date change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Fetch data when date range changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const incomes = await getIncomes();
                
                if (!incomes || incomes.length === 0) {
                    setChartData([]);
                    setError("No income data available");
                    setIsLoading(false);
                    return;
                }
                
                // Filter incomes within date range
                const startDate = new Date(dateRange.startDate);
                const endDate = new Date(dateRange.endDate);
                
                const filteredIncomes = incomes.filter(income => {
                    const incomeDate = new Date(income.date);
                    return incomeDate >= startDate && incomeDate <= endDate;
                });
                
                // Group by date
                const incomesByDate = {};
                
                filteredIncomes.forEach(income => {
                    try {
                        // Validate the date string
                        const dateStr = new Date(income.date).toISOString().substring(0, 10); // YYYY-MM-DD
                        const dateObj = new Date(dateStr);
                        
                        // Check if date is valid
                        if (isNaN(dateObj.getTime())) {
                            console.warn("Invalid date found:", income.date);
                            return; // Skip invalid dates
                        }
                        
                        if (!incomesByDate[dateStr]) {
                            incomesByDate[dateStr] = { 
                                date: dateStr,
                                amount: 0 
                            };
                        }
                        incomesByDate[dateStr].amount += parseFloat(income.amount || 0);
                    } catch (dateErr) {
                        console.warn("Error processing date:", income.date, dateErr);
                        // Skip items with invalid dates
                    }
                });
                
                // Convert to array and sort by date
                const data = Object.values(incomesByDate).sort((a, b) => 
                    a.date.localeCompare(b.date)
                );
                
                setChartData(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching date range data:", err);
                setError("Failed to load income data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getIncomes, dateRange]);
    
    const formatXAxis = (tickItem) => {
        try {
            // Validate that the string is a proper date
            const date = parseISO(tickItem);
            // Check if date is invalid
            if (!isValid(date)) {
                return "Invalid";
            }
            return format(date, 'MM/dd');
        } catch (e) {
            return "Invalid";
        }
    };
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            try {
                const date = parseISO(label);
                // Check if parsed date is valid
                if (!isValid(date)) {
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
                <h2 className="text-xl font-semibold mb-2">Income by Date Range</h2>
                
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
                    No income data available for the selected date range
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
                                stroke="#3b82f6" 
                                fill="url(#colorGradient)" 
                                activeDot={{ r: 8 }} 
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default IncomeDateRangeChart;
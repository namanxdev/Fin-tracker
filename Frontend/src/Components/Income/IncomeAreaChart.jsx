import React, { useState, useEffect } from 'react';
import { 
    AreaChart, 
    Area, 
    BarChart,  
    Bar,       
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { format, parseISO, isValid } from 'date-fns';
import useIncomeStore from '../../store/incomeStore';
import useThemeStore from '../../store/themeStore';

function IncomeAreaChart({ viewMode = 'total' }) {
    const isDark = useThemeStore(state => state.isDark());
    const { getMonthlySummary, getYearlySummary,getLast12MonthsData } = useIncomeStore();
    
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let result;
                
                if (viewMode === 'monthly') {
                    result = await getMonthlySummary();
                    // console.log('Result of monthly:',result);
                    
                    if (result && result.monthlyData) {
                        // More robust data transformation for monthly view
                        const chartData = result.monthlyData.map(item => {
                            let dateStr;
                            
                            // Handle different possible data structures
                            if (item._id && typeof item._id === 'object') {
                                const month = item._id.month;
                                const year = item._id.year;
                                
                                // Ensure month is padded with leading zero if needed
                                const paddedMonth = String(month).padStart(2, '0');
                                dateStr = `${year}-${paddedMonth}`;
                            } else {
                                // Fallback if structure is unexpected
                                dateStr = new Date().toISOString().substring(0, 7); // YYYY-MM format
                            }
                            
                            return {
                                date: dateStr,
                                amount: parseFloat(item.total || 0)
                            };
                        })
                        .sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically
                        
                        setChartData(chartData);
                    } else {
                        setChartData([]);
                    }
                } else if (viewMode === 'yearly') {
                    result = await getYearlySummary();
                    console.log('Result of yearly:', result);
                    
                    if (result && result.yearlyData) {
                        // Group by year and sum the totals (necessary because we're getting monthly data)
                        const yearlyTotals = {};
                        
                        result.yearlyData.forEach(item => {
                            let year;
                            
                            // Extract year from various possible structures
                            if (item._id && typeof item._id === 'object' && item._id.year) {
                                year = item._id.year;
                            } else if (typeof item._id === 'number') {
                                year = item._id;
                            } else if (item._id && typeof item._id === 'object') {
                                // Try to extract first property that looks like a year
                                for (const prop in item._id) {
                                    if (item._id[prop] > 1900 && item._id[prop] < 3000) {
                                        year = item._id[prop];
                                        break;
                                    }
                                }
                            }
                            
                            // Skip if year couldn't be determined
                            if (!year) return;
                            
                            // Sum amounts for the same year
                            if (!yearlyTotals[year]) {
                                yearlyTotals[year] = 0;
                            }
                            yearlyTotals[year] += parseFloat(item.total || 0);
                        });
                        
                        // Convert to chart format
                        const chartData = Object.entries(yearlyTotals)
                            .map(([year, amount]) => ({
                                date: year.toString(),
                                amount: amount
                            }))
                            .sort((a, b) => parseInt(a.date) - parseInt(b.date));
                        
                        console.log("Processed yearly data:", chartData);
                        
                        // Fill in missing years if needed
                        if (chartData.length > 1) {
                            const minYear = parseInt(chartData[0].date);
                            const maxYear = parseInt(chartData[chartData.length - 1].date);
                            
                            const filledData = [];
                            for (let year = minYear; year <= maxYear; year++) {
                                const existingData = chartData.find(item => parseInt(item.date) === year);
                                filledData.push(existingData || { date: year.toString(), amount: 0 });
                            }
                            
                            setChartData(filledData);
                        } else {
                            setChartData(chartData);
                        }
                    } else {
                        setChartData([]);
                    }
                } else {
                    result = await getLast12MonthsData();
                    // console.log('Result of last 12 months:',result);
                    if (result && result.last12MonthsData) {
                        setChartData(result.last12MonthsData);
                    } else {
                        setChartData([]);
                    }
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching chart data:", err);
                setError("Failed to load income data");
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [getMonthlySummary, getYearlySummary, viewMode]);
    
    const formatXAxis = (tickItem) => {
        try {
            if (viewMode === 'yearly') {
                // For yearly view, just return the year
                return tickItem;
            }
            
            // For other views, format the date
            const date = parseISO(tickItem);
            if (!isValid(date)) return 'Invalid';
            
            return format(date, 'MMM yyyy');
        } catch (e) {
            return 'Invalid';
        }
    };
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            try {
                let formattedDate = label;
                
                // If not yearly view, try to format as date
                if (viewMode !== 'yearly') {
                    const date = parseISO(label);
                    if (isValid(date)) {
                        formattedDate = format(date, 'MMMM yyyy');
                    }
                }
                
                return (
                    <div className={`p-3 rounded-md shadow-md ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <p className="font-bold">{formattedDate}</p>
                        <p className="text-sm">
                            ${payload[0].value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                );
            } catch (e) {
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
    
    const title = viewMode === 'monthly' 
        ? 'Monthly Income Summary' 
        : viewMode === 'yearly' 
            ? 'Yearly Income Summary' 
            : 'Income Trends';
    
    if (isLoading) {
        return (
            <div className={`p-4 rounded-lg shadow-md h-80 flex items-center justify-center ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
                <div className="loading loading-spinner loading-lg"></div>
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
                    No income data available to display
                </p>
            </div>
        );
    }
    
    return (
        <div className={`p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'yearly' ? (
                        // Bar chart for yearly data
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
                            <XAxis 
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                stroke={isDark ? '#ccc' : '#666'} 
                                // Add this to only show years that have data
                                type="category"
                                allowDuplicatedCategory={false}
                            />
                            <YAxis 
                                stroke={isDark ? '#ccc' : '#666'}
                                tickFormatter={(value) => `$${value}`} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="amount" 
                                fill="#3b82f6" 
                                radius={[4, 4, 0, 0]} // Rounded top corners
                            />
                        </BarChart>
                    ) : (
                        // Area chart for monthly/default view
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
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default IncomeAreaChart;
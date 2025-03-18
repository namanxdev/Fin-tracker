import React, { useEffect, useState } from 'react';
import useExpenseStore from "../../store/expenseStore";
import useThemeStore from "../../store/themeStore"; 
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Custom colors for the pie chart
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

function ExpensesPieChart() {
    const isDark = useThemeStore(state => state.isDark());
    const getCategorySummary = useExpenseStore(state => state.getCategorySummary);
    const isLoading = useExpenseStore(state => state.isLoading);
    const [categoryData, setCategoryData] = useState([]);
    const [error, setError] = useState(null);

    // Fetch category data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching category data...");
                const data = await getCategorySummary();
                console.log("Raw API response:", data);
                
                // Check if we're getting valid data
                if (data && Array.isArray(data)) {
                    // Format: [{ _id: "Category", total: 123.45 }, ...]
                    const transformed = data.map(item => {
                        console.log("Processing item:", item);
                        return {
                            name: item._id || 'Uncategorized',
                            value: parseFloat(parseFloat(item.total || 0).toFixed(2))
                        };
                    });
                    console.log("Transformed chart data:", transformed);
                    setCategoryData(transformed);
                } else {
                    console.error("Invalid data format received:", data);
                    setError("Invalid data format received");
                }
            } catch (err) {
                console.error("Error fetching category data:", err);
                setError(`Failed to load category data: ${err.message}`);
            }
        };
    
        fetchData();
    }, [getCategorySummary]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            // Store the first payload item
            const item = payload[0];
            
            // Debug what we're getting
            console.log("Tooltip payload:", payload);
            
            return (
                <div className={`p-3 rounded-md shadow-md ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                                        <p className="font-bold">{item.name}</p>
                    {/* Use ITEM.value - not data.value */}
                    <p className="text-sm">${item.value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                </div>
            );
        }
        return null;
    };

    // Calculate total for percentage display
    const Sumtotal = categoryData.reduce((sum, item) => sum + item.value, 0);
    console.log("Total sum of category data:", Sumtotal);
    // Custom legend that shows percentages
    const renderCustomizedLegend = (props) => {
        const { payload } = props;
        
        return (
            <ul className={`flex flex-wrap justify-center gap-4 mt-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
                {payload.map((entry, index) => {
                    // FIX: Calculate percentage correctly using entry.value / Sumtotal
                    console.log("Payload entry:", entry);
                    console.log("percentage:",entry.payload.percent*100);
                    const percent= Number(entry.payload.percent*100).toFixed(1);
                    
                    const color = entry.color
                    
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

    return (
        <div className={`rounded-lg p-4 shadow-md ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
            <h2 className="text-xl font-semibold mb-4 text-center">Expenses by Category</h2>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading category data...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">
                    <p>{error}</p>
                </div>
            ) : categoryData.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p>No expense data available</p>
                </div>
            ) : (
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                content={renderCustomizedLegend}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ExpensesPieChart;
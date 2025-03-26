import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import DashboardCard from './DashboardCard';
import useThemeStore from '../../store/themeStore';

const CashFlowChart = ({ data, loading = false, months = 6, onPeriodChange }) => {
  const [animate, setAnimate] = useState(false);
  const isDarkMode = useThemeStore(state => state.isDark());
  
  useEffect(() => {
    // Add entrance animation when data loads
    if (data && data.length > 0) {
      setAnimate(true);
    }
  }, [data,months]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handlePeriodChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (onPeriodChange && typeof onPeriodChange === 'function') {
      onPeriodChange(newValue);
    }
  };

  const periodSelector = (
    <select 
      className={`text-sm border rounded-lg px-3 py-1.5
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                shadow-sm cursor-pointer transition-colors
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
      value={months}
      onChange={handlePeriodChange}
    >
      <option value="3">3 Months</option>
      <option value="6">6 Months</option>
      <option value="12">12 Months</option>
    </select>
  );

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} p-3 border shadow-lg rounded-lg`}>
          <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>{`Period: ${label}`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center mb-1 last:mb-0">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span>{formatCurrency(entry.value)}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Define chart colors based on theme
  const chartColors = {
    income: isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)',  // Brighter green for dark mode
    expenses: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(239, 68, 68)', // Lighter red for dark mode
    net: isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)'      // Lighter blue for dark mode
  };

  return (
    <DashboardCard 
      title="Cash Flow" 
      titleRight={periodSelector}
      loading={loading}
      fullHeight
      className={`${isDarkMode ? 'shadow-xl shadow-blue-900/10' : 'shadow-md'}`}
    >
      <div className={`h-64 md:h-80 ${animate ? 'animate-fadeIn' : ''}`}>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={isDarkMode ? 0.1 : 0.15} stroke={isDarkMode ? '#fff' : '#000'} />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
                tickLine={false}
                stroke={isDarkMode ? '#555' : '#ccc'}
              />
              <YAxis 
                tickFormatter={formatCurrency} 
                tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }} 
                tickLine={false}
                axisLine={false}
                stroke={isDarkMode ? '#555' : '#ccc'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                formatter={(value) => <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke={chartColors.income}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                name="Expenses" 
                stroke={chartColors.expenses}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                animationDuration={1500}
                animationBegin={300}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                name="Net" 
                stroke={chartColors.net}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                animationDuration={1500}
                animationBegin={600}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-2">📊</div>
              <p>No cash flow data available</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardCard>
  );
};

export default CashFlowChart;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import DashboardCard from './DashboardCard';
import useThemeStore from '../../store/themeStore';
import useDashboardStore from '../../store/dashboardStore';
import { TrendingUp } from 'lucide-react';

const SavingsAnalysis = ({ data, loading = false }) => {
  const isDarkMode = useThemeStore(state => state.isDark());
  const isNewUser = useDashboardStore(state => state.isNewUser);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const savingsData = data?.savingsData?.find(item => item.period === label);
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} p-3 border shadow-md rounded-lg`}>
          <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>{label}</p>
          <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-lg font-bold`}>
            {formatCurrency(payload[0].value)}
          </p>
          {savingsData && (
            <div className={`mt-1 pt-1 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex justify-between`}>
                <span>Savings Rate:</span>
                <span className="font-medium">{savingsData.savingsRate.toFixed(1)}%</span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Define chart colors based on theme
  const chartColors = {
    bar: isDarkMode ? 'rgba(120, 190, 255, 0.85)' : 'rgba(59, 130, 246, 0.8)',
    referenceLine: isDarkMode ? '#a78bfa' : '#6366F1',
    text: isDarkMode ? '#e5e7eb' : '#374151'
  };

  return (
    <DashboardCard 
      title="Savings Analysis" 
      loading={loading}
      fullHeight
      className={`${isDarkMode ? 'shadow-xl shadow-blue-900/10' : 'shadow-md'}`}
    >
      <div className="h-110">
        {isNewUser ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">💰</div>
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                Start tracking your savings
              </h3>
              <p className={`text-sm max-w-xs mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your income and expenses to automatically calculate savings and see your progress over time
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/budget" className={`flex items-center px-4 py-2 rounded-md text-white 
                  ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} transition-colors`}>
                  Start Savings Goal <TrendingUp className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ) : data?.savingsData && data.savingsData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="60%">
              <BarChart
                data={data.savingsData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={isDarkMode ? 0.1 : 0.15} stroke={isDarkMode ? '#444' : '#ccc'} vertical={false} />
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: chartColors.text }}
                  stroke={isDarkMode ? '#555' : '#ccc'}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: chartColors.text }}
                  stroke={isDarkMode ? '#555' : '#ccc'}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }} 
                  formatter={(value) => (
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{value}</span>
                  )}
                />
                <ReferenceLine 
                  y={data.summary.averageSavingsRate || 0} 
                  stroke={chartColors.referenceLine}
                  strokeDasharray="3 3"
                  strokeWidth={2} 
                  label={{ 
                    value: 'Avg', 
                    position: 'right', 
                    fill: chartColors.referenceLine, 
                    fontSize: 12 
                  }}
                />
                <Bar
                  name="Monthly Savings"
                  dataKey="monthlySavings"
                  fill={chartColors.bar}
                  radius={[4, 4, 0, 0]}
                  fontSize={12}
                  barSize={30}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className={`text-center p-4 ${
                isDarkMode 
                  ? 'bg-blue-900/20 shadow-lg border border-blue-900/20 hover:border-blue-800/30' 
                  : 'bg-blue-50 shadow-inner hover:bg-blue-100/50'
                } rounded-lg transition-all duration-300`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-1`}>Average Savings Rate</p>
                <p className="text-2xl font-bold">{data.summary.averageSavingsRate}%</p>
              </div>
              <div className={`text-center p-4 ${
                isDarkMode 
                  ? 'bg-green-900/20 shadow-lg border border-green-900/20 hover:border-green-800/30' 
                  : 'bg-green-50 shadow-inner hover:bg-green-100/50'
                } rounded-lg transition-all duration-300`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1`}>Total Saved</p>
                <p className="text-2xl font-bold">${data.summary.totalSaved.toLocaleString()}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">💰</div>
              <p className="text-gray-500 dark:text-gray-400">No savings data available</p>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default SavingsAnalysis;

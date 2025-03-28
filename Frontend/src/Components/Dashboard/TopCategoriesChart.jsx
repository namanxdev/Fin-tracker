import React from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import DashboardCard from './DashboardCard';
import useThemeStore from '../../store/themeStore';
import useDashboardStore from '../../store/dashboardStore';
import { PlusCircle } from 'lucide-react';

// More vibrant color palette for the chart with dark mode variants
const CHART_COLORS = {
  light: [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // amber
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#6366F1', // indigo
  ],
  dark: [
    '#60A5FA', // lighter blue
    '#F87171', // lighter red
    '#34D399', // lighter green
    '#FBBF24', // lighter amber
    '#A78BFA', // lighter purple
    '#F472B6', // lighter pink
    '#22D3EE', // lighter cyan
    '#FB923C', // lighter orange
    '#818CF8', // lighter indigo
  ]
};

const TopCategoriesChart = ({ data, loading = false }) => {
  const isDarkMode = useThemeStore(state => state.isDark());
  const isNewUser = useDashboardStore(state => state.isNewUser);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = data.payload.total;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'} p-3 border shadow-lg rounded-lg`}>
          <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{data.name}</p>
          <p className="text-lg font-bold">
            ${data.value.toLocaleString()}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {percentage}% of total spending
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || !data.topCategories || data.topCategories.length === 0) {
    return (
      <DashboardCard title="Top Spending Categories" loading={loading} fullHeight>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">🍕</div>
            {isNewUser ? (
              <>
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                  Track where your money goes
                </h3>
                <p className={`text-sm max-w-xs mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add expenses with categories to see your spending patterns
                </p>
                <Link to="/expenses" className={`inline-flex items-center px-4 py-2 rounded-md text-white 
                  ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Categorized Expense
                </Link>
              </>
            ) : (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No category data available
              </p>
            )}
          </div>
        </div>
      </DashboardCard>
    );
  }

  // Transform data for recharts
  const chartData = data.topCategories.map(cat => ({
    name: cat._id,
    value: cat.total,
    total: data.expenses // Pass total for percentage calculation
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't show labels for tiny slices
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom label for the center of the chart
  const CenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text 
          x={cx} 
          y={cy - 10} 
          textAnchor="middle" 
          dominantBaseline="central" 
          className={`text-xs ${isDarkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
        >
          Total Spending
        </text>
        <text 
          x={cx} 
          y={cy + 15} 
          textAnchor="middle" 
          dominantBaseline="central" 
          className={`text-lg font-bold ${isDarkMode ? 'fill-gray-200' : 'fill-gray-800'}`}
        >
          ${data.expenses.toLocaleString()}
        </text>
      </g>
    );
  };

  // Get the correct color palette based on theme
  const colorPalette = isDarkMode ? CHART_COLORS.dark : CHART_COLORS.light;

  return (
    <DashboardCard 
      title="Top Spending Categories" 
      loading={loading}
      fullHeight
      className={`${isDarkMode ? 'shadow-xl shadow-indigo-900/10' : 'shadow-md'}`}
    >
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
              animationDuration={1000}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorPalette[index % colorPalette.length]} 
                  stroke={isDarkMode ? "#1f2937" : "white"}
                  strokeWidth={2}
                  className="hover:opacity-90 transition-opacity duration-300"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconSize={10}
              iconType="circle"
              formatter={(value) => (
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:opacity-80 transition-opacity duration-200`}>
                  {value}
                </span>
              )}
              wrapperStyle={{
                fontSize: '12px',
                paddingLeft: '10px'
              }}
            />
            <CenterLabel viewBox={{ cx: "50%", cy: "50%" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default TopCategoriesChart;

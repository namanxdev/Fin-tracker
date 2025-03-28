import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import useThemeStore from '../../store/themeStore';
import useDashboardStore from '../../store/dashboardStore';
import { Target } from 'lucide-react';

const BudgetPerformance = ({ data, loading = false }) => {
  const isDarkMode = useThemeStore(state => state.isDark());
  const isNewUser = useDashboardStore(state => state.isNewUser);
  
  // Function to determine the color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Exceeded':
        return {
          bg: isDarkMode ? 'bg-red-600/90' : 'bg-red-500',
          text: isDarkMode ? 'text-red-400' : 'text-red-600',
          light: isDarkMode ? 'bg-red-900/30' : 'bg-red-50',
          border: isDarkMode ? 'border-red-900/50' : 'border-red-200'
        };
      case 'Warning':
        return {
          bg: isDarkMode ? 'bg-yellow-600/90' : 'bg-yellow-500',
          text: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
          light: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
          border: isDarkMode ? 'border-yellow-900/50' : 'border-yellow-200'
        };
      case 'Caution':
        return {
          bg: isDarkMode ? 'bg-orange-500/90' : 'bg-orange-400',
          text: isDarkMode ? 'text-orange-400' : 'text-orange-600',
          light: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50',
          border: isDarkMode ? 'border-orange-900/50' : 'border-orange-200'
        };
      case 'Good':
        return {
          bg: isDarkMode ? 'bg-green-600/90' : 'bg-green-500',
          text: isDarkMode ? 'text-green-400' : 'text-green-600',
          light: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
          border: isDarkMode ? 'border-green-900/50' : 'border-green-200'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
          text: isDarkMode ? 'text-gray-400' : 'text-gray-600',
          light: isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
        };
    }
  };

  return (
    <DashboardCard 
      title="Budget Performance" 
      loading={loading}
      fullHeight
      className={`${isDarkMode ? 'shadow-xl shadow-purple-900/10' : 'shadow-md'}`}
    >
      {data && data.length > 0 ? (
        <div className="overflow-y-auto max-h-96 space-y-5 pr-1 custom-scrollbar">
          {data.map((budget, index) => {
            const colors = getStatusColor(budget.status);
            return (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${colors.border}
                          transition-all duration-300 ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} 
                          hover:shadow-md`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-lg">{budget.category}</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.light}`}>
                      {budget.status}
                    </span>
                  </div>
                </div>
                
                <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  <span className="font-medium">${budget.spent.toLocaleString()} of ${budget.limit.toLocaleString()}</span>
                  <span className="font-bold">{budget.percentUsed}%</span>
                </div>
                
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-3 overflow-hidden shadow-inner`}>
                  <div 
                    className={`h-full rounded-full ${colors.bg} transition-all duration-500 ease-in-out`} 
                    style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className={`text-xs font-medium ${colors.text}`}>
                    ${budget.remaining.toLocaleString()} remaining
                  </span>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {budget.daysLeft} days left (${budget.dailyBudgetRemaining}/day)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2 ">📋</div>
            {isNewUser ? (
              <>
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                  Set budgets to stay on track
                </h3>
                <p className={`text-sm max-w-xs mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Create your first budget to monitor spending and reach your financial goals
                </p>
                <Link to="/budgets/create" className={`flex items-center justify-center mx-auto px-4 py-2 text-white rounded-lg transition-all duration-300
                                ${isDarkMode 
                                  ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20' 
                                  : 'bg-purple-500 hover:bg-purple-600 shadow-md'}`}>
                  <Target className="h-4 w-4 mr-2" /> 
                  <span className="text-center">Create First Budget</span>
                </Link>
              </>
            ) : (
              <>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No budget data available</p>
                <Link to="/budget" className={`mt-4 flex items-center justify-center mx-auto px-4 py-2 text-white rounded-lg transition-all duration-300
                                ${isDarkMode 
                                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20' 
                                  : 'bg-blue-500 hover:bg-blue-600 shadow-md'}`}>
                  Create Budget
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 10px;
        }
      `}</style>
    </DashboardCard>
  );
};

export default BudgetPerformance;
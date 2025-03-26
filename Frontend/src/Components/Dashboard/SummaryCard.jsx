import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

const SummaryCard = ({ title, amount, trend = 0, icon, className = "", prefix = "$" }) => {
  const isPositive = trend >= 0;
  const isDarkMode = useThemeStore(state => state.isDark());
  
  const getBorderColor = () => {
    if (className.includes('border-blue')) return isDarkMode ? 'border-blue-600' : 'border-blue-500';
    if (className.includes('border-red')) return isDarkMode ? 'border-red-600' : 'border-red-500';
    if (className.includes('border-green')) return isDarkMode ? 'border-green-600' : 'border-green-500';
    if (className.includes('border-purple')) return isDarkMode ? 'border-purple-600' : 'border-purple-500';
    return isDarkMode ? 'border-gray-600' : 'border-gray-400';
  };
  
  return (
    <div className={`
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      rounded-xl ${isDarkMode ? 'shadow-lg shadow-gray-900/10' : 'shadow-md'}
      transition-all duration-300 ease-in-out 
      p-5 
      border-l-4 ${getBorderColor()}
      transform hover:-translate-y-1
      ${isDarkMode ? 'hover:bg-gray-800/70' : 'hover:bg-gray-50/70'}
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold mt-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {prefix}{parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {icon && (
          <div className={`rounded-full ${isDarkMode 
            ? 'bg-blue-900/50 text-blue-400 shadow-inner shadow-blue-900/30' 
            : 'bg-blue-100 text-blue-600 shadow-inner'} 
            p-3`}>
            {icon}
          </div>
        )}
      </div>
      {trend !== null && (
        <div className={`
          flex items-center mt-4 text-sm font-medium 
          ${isPositive 
            ? `${isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-500 bg-green-50'}` 
            : `${isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-500 bg-red-50'}`} 
          rounded-full px-2 py-1 w-fit
        `}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(trend).toFixed(1)}% from last month</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

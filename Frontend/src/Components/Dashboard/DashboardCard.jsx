import React from 'react';
import useThemeStore from '../../store/themeStore';

const DashboardCard = ({ 
  title, 
  children, 
  className = "", 
  titleRight = null,
  loading = false,
  fullHeight = false
}) => {
  const isDarkMode = useThemeStore(state => state.isDark());
  
  return (
    <div 
      className={`
        ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}
        rounded-xl transition-all duration-300 ease-in-out 
        overflow-hidden 
        border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}
        ${fullHeight ? 'h-full' : ''} 
        ${className}
      `}
    >
      {title && (
        <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} 
                        flex justify-between items-center 
                        ${isDarkMode ? 'bg-gray-800/80' : 'bg-white'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
          {titleRight && <div>{titleRight}</div>}
        </div>
      )}
      <div className={`p-5 ${loading ? 'animate-pulse' : ''}`}>
        {loading ? (
          <div className="flex flex-col space-y-4 h-32 items-center justify-center">
            <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex-1 space-y-4 py-1 w-full">
              <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-3/4 mx-auto`}></div>
              <div className="space-y-2">
                <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full w-5/6`}></div>
              </div>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Loading data...</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DashboardCard;

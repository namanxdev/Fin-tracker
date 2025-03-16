// src/Components/Theme/ThemeToggle.jsx
import React from 'react';
import useThemeStore from '../../store/themeStore';

const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">☀️</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                        peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 
                        rounded-full peer dark:bg-gray-700 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                        peer-checked:bg-emerald-600"></div>
      </label>
      <span className="text-lg">🌙</span>
    </div>
  );
};

export default ThemeToggle;
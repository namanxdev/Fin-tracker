import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage on initial mount
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply theme to document when it changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document for DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also update class for Tailwind dark mode
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check for user's system preference on initial load
  useEffect(() => {
    const userPrefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    // If user has not set a theme in localStorage, apply system preference
    // This will only run on the first load
    if (userPrefersDark && !localStorage.getItem('theme')) {
        setTheme('dark'); 
    }
    
    // Optional: Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
        </ThemeContext.Provider>
  );
};
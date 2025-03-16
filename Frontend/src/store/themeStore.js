// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set, get) => ({
        theme: 'light', // default theme
        
        // Getter to check if theme is dark
        isDark: () => get().theme === 'dark',
        
        // Set theme to specific value
        setTheme: (theme) => {
            set({ theme });
            updateThemeInDOM(theme);
        },
        
        // Toggle between light and dark
        toggleTheme: () => {
            const newTheme = get().theme === 'light' ? 'dark' : 'light';
            set({ theme: newTheme });
            updateThemeInDOM(newTheme);
        },
        
        // Initialize theme based on system preference
        initializeTheme: () => {
            // Only run if there's no persisted theme already
            if (!get().hasHydrated) {
            const userPrefersDark = window.matchMedia && 
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (userPrefersDark) {
                set({ theme: 'dark' });
                updateThemeInDOM('dark');
            }
            }
        }
        }),
        {
        name: 'theme-storage',
        onRehydrateStorage: () => (state) => {
            if (state) {
            updateThemeInDOM(state.theme);
            state.hasHydrated = true;
            }
        }
        }
    )
    );

    // Helper function to update DOM with theme
    function updateThemeInDOM(theme) {
    // Apply theme to document for DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also update class for Tailwind dark mode
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export default useThemeStore;
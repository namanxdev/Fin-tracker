// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

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
            if(newTheme === 'dark') {
                toast('Hello Darkness!',
                        {
                        icon: '🌙',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        }
                    );
            }
            else {
                toast('Hello Sunshine!', 
                    {
                    icon: '☀️',
                    style: {
                        borderRadius: '10px',
                        background: '#f8fafc', // Light gray background
                        color: '#334155',      // Slate-700 text
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e2e8f0' // Subtle border
                    },
                    }
                )
            }
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
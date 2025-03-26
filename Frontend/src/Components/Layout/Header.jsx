import React from 'react';
import NavBar from './NavBar';
import { Landmark } from 'lucide-react';
import ThemeToggle from '../Theme/ThemeToggle';
import UserMenu from './UserMenu';
import useThemeStore from '../../store/themeStore';

function Header() {
    const isDark = useThemeStore((state) => state.isDark());

    return (
        <>
            {/* Fixed height spacer to prevent content from hiding behind fixed header */}
            <div className="h-20"></div>
            
            {/* Fixed header with enhanced transparency */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 h-20 shadow-md backdrop-blur-sm transition-colors duration-300
                    ${isDark 
                        ? "bg-gray-950/40 text-white" 
                        : "bg-white/30 text-black"}`}
            >
                <div className="flex flex-row justify-between items-center h-full px-4 max-w-7xl mx-auto">
                    <div className="flex flex-row items-center ml-2">
                        <Landmark className={`h-10 w-12 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                        
                        <h1 className={`text-2xl font-bold ml-2 ${isDark?'text-white':'text-black'}`}>Fin
                            <span className={`${isDark ? "text-emerald-300" : "text-emerald-600"}`}>Track</span>
                        </h1>
                    </div>
                    <NavBar />
                    <div className='flex flex-row items-center mr-2 space-x-2'>
                        {/* Toggle Themes */}
                        <div className='mr-4'>
                            <ThemeToggle />
                        </div>
                        {/* User Menu */}
                        <UserMenu />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
import React from 'react';
import NavBar from './NavBar';
import ThemeToggle from '../Theme/ThemeToggle';
import UserMenu from './UserMenu';
import Logo from './Logo'
import useThemeStore from '../../store/themeStore';

function Header() {
    const isDark = useThemeStore((state) => state.isDark());

    return (
        <>
            {/* Fixed height spacer to prevent content from hiding behind fixed header */}
            <div className="h-16 sm:h-20"></div>
            
            {/* Fixed header with enhanced transparency */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 shadow-md backdrop-blur-sm transition-colors duration-300
                    ${isDark 
                        ? "bg-gray-950/40 text-white" 
                        : "bg-white/30 text-black"}`}
            >
                <div className='flex items-center justify-between h-full px-2 sm:px-4'>
                    <Logo/>
                    <NavBar />
                    {/* Hide on small screens, show on medium and up */}
                    <div className='hidden md:flex items-center space-x-4'>
                        <ThemeToggle />
                        <UserMenu />
                    </div>    
                </div>
            </div>
        </>
    );
}

export default Header;
import React, { useState, useEffect } from 'react';
import useThemeStore from '../../store/themeStore';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import { Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import ThemeToggle from '../Theme/ThemeToggle';

function NavBar() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const isDark = useThemeStore((state) => state.isDark());

    // Define navigation items
    const navItems = [
        { name: 'DashBoard', path: '/dashboard' },
        { name: 'Expenses', path: '/expenses' },
        { name: 'Income', path: '/income' },
        { name: 'Budget', path: '/budget' },
    ];

    // Update active item based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            setActiveItem(null);
            return;
        }
        const route = path.substring(1);
        const item = navItems.find(item =>
            item.path.substring(1).toLowerCase() === route.toLowerCase()
        );
        if (item) setActiveItem(item.name);
    }, [location, navItems]);

        // Auto-close mobile menu on window resize
        useEffect(() => {
            const handleResize = () => {
                if (window.innerWidth >= 768) { // 768px is Tailwind's md breakpoint
                    setMobileMenuOpen(false);
                }
            };
    
            // Add event listener
            window.addEventListener('resize', handleResize);
    
            // Call once to check initial size
            handleResize();
    
            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);
    
        // Close mobile menu when route changes
        useEffect(() => {
            setMobileMenuOpen(false);
        }, [location.pathname]);

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center items-center bg-transparent p-4 w-full">
                <div className={`nav-container flex flex-row items-center rounded-full p-2 shadow-lg mx-auto border relative overflow-hidden
          ${isDark
                        ? 'bg-gray-900/30 border border-gray-600 shadow-emerald-900/20'
                        : 'bg-white/20 border border-gray-300 shadow-emerald-600/10'
                    } backdrop-blur-sm`}
                >
                    {/* Glow effects */}
                    <div className="nav-glow-1"></div>
                    <div className="nav-glow-2"></div>

                    <div className="flex flex-row space-x-1 z-10">
                        {navItems.map((item) => (
                            <Link
                                to={item.path}
                                key={item.name}
                                className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${activeItem === item.name
                                        ? (isDark
                                            ? 'bg-emerald-600/80 text-white font-bold shadow-lg shadow-emerald-900/30'
                                            : 'bg-emerald-400/80 text-gray-900 font-bold shadow-lg shadow-emerald-600/20')
                                        : (isDark
                                            ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white'
                                            : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900')
                                    }`}
                                onClick={() => setActiveItem(item.name)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Header - Changed to justify-end to position menu at end */}
            <div className="md:hidden flex justify-end items-center p-3 w-full">
                {/* Hamburger Menu Button - moved to end */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`p-2 rounded-full ${isDark ? 'bg-gray-800/50 hover:bg-gray-700' : 'bg-gray-100/50 hover:bg-gray-200'}`}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className={`absolute top-16 left-4 right-4 p-3 rounded-xl shadow-lg z-50 border
                    ${isDark
                        ? 'bg-gray-900/95 border-gray-700'
                        : 'bg-white/95 border-gray-200'
                    } backdrop-blur-md`}
                >
                    {/* Navigation links */}
                    <div className="flex flex-col space-y-1">
                        {navItems.map((item) => (
                            <Link
                                to={item.path}
                                key={item.name}
                                className={`px-4 py-3 rounded-lg transition-all ${activeItem === item.name
                                        ? (isDark
                                            ? 'bg-emerald-600/80 text-white font-bold'
                                            : 'bg-emerald-400/80 text-gray-900 font-bold')
                                        : (isDark
                                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900')
                                    }`}
                                onClick={() => {
                                    setActiveItem(item.name);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    
                    {/* User controls section - ThemeToggle and UserMenu side by side */}
                    <div className={`mt-4 pt-4 border-t flex items-center justify-between
                        ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        {/* UserMenu takes up more space */}
                        <div className="flex-grow">
                            <UserMenu isDark={isDark} />
                        </div>
                        {/* ThemeToggle placed to the right */}
                        <div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;

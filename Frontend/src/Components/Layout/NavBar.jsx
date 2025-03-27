import React, { useState, useEffect } from 'react';
import useThemeStore from '../../store/themeStore';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import { Menu, X } from 'lucide-react';

function NavBar() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const isDark = useThemeStore((state) => state.isDark());

    // Update active item based on current route
    useEffect(() => {
        const path = location.pathname;
        
        // If on homepage, set no active item
        if (path === '/') {
            setActiveItem(null);
            return;
        }
        
        // Otherwise, find the matching nav item
        const route = path.substring(1);
        const item = navItems.find(item => 
            item.path.substring(1).toLowerCase() === route.toLowerCase()
        );
        
        if (item) setActiveItem(item.name);
    }, [location]);

    const navItems = [
        { name: 'DashBoard', path: '/dashboard' },
        { name: 'Expenses', path: '/expenses' },
        { name: 'Income', path: '/income' },
        { name: 'Budget', path: '/budget' },
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center items-center bg-transparent p-4 w-full">
                <div className={`nav-container flex flex-row items-center rounded-full p-2 shadow-lg mx-auto border relative overflow-hidden
                    ${isDark 
                    ? 'bg-gray-900/30 border border-gray-600 shadow-emerald-900/20' 
                    : 'bg-white/20 border border-gray-300 shadow-emerald-600/10'
                } backdrop-blur-sm`}>
                    {/* Glow effects */}
                    <div className="nav-glow-1"></div>
                    <div className="nav-glow-2"></div>
                    
                    <div className="flex flex-row space-x-1 z-10">
                        {navItems.map((item) => (
                            <Link 
                                to={item.path}
                                key={item.name}
                                className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                                    activeItem === item.name 
                                    ? `${isDark 
                                        ? 'bg-emerald-600/80 text-white font-bold shadow-lg shadow-emerald-900/30' 
                                        : 'bg-emerald-400/80 text-gray-900 font-bold shadow-lg shadow-emerald-600/20'}`
                                    : `${isDark 
                                        ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                        : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                                }`}
                                onClick={() => setActiveItem(item.name)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-center items-center p-3 w-full">
                <div className={`w-full max-w-md flex justify-between items-center rounded-full px-4 py-2 shadow-md border relative
                    ${isDark 
                    ? 'bg-gray-900/30 border-gray-600 text-white' 
                    : 'bg-white/20 border-gray-200 text-gray-900'
                    } backdrop-blur-sm`}>
                    <span className="font-bold">Financer</span>
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
                        } backdrop-blur-md`}>
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item) => (
                                <Link 
                                    to={item.path}
                                    key={item.name}
                                    className={`px-4 py-3 rounded-lg transition-all ${
                                        activeItem === item.name 
                                        ? `${isDark 
                                            ? 'bg-emerald-600/80 text-white font-bold' 
                                            : 'bg-emerald-400/80 text-gray-900 font-bold'}`
                                        : `${isDark 
                                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                                            : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'}`
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
                    </div>
                )}
            </div>
        </>
    );
}

export default NavBar;
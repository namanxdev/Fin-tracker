import React, { useState } from 'react';
import useThemeStore from '../../store/themeStore';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Create this file for the glow effect

function NavBar() {
    const [activeItem, setActiveItem] = useState('DashBoard');
    const isDark = useThemeStore((state) => state.isDark());

    const navItems = [
        { name: 'DashBoard', path: '/dashboard' },
        { name: 'Expenses', path: '/expenses' },
        { name: 'Income', path: '/income' },
        { name: 'Budget', path: '/budget' },
        { name: 'Reports', path: '/reports' }
    ];

    return (
        <div className="flex justify-center items-center bg-transparent p-4 w-full">
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
    );
}

export default NavBar;
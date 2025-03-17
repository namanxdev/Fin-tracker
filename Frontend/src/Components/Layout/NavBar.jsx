import React, { useState } from 'react';
import useThemeStore from '../../store/themeStore';
import { Link } from 'react-router-dom';

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
            <div className={`flex flex-row items-center rounded-full p-2 shadow-lg mx-auto border ${
                isDark 
                ? 'bg-gray-900/40 border-2 border-white' 
                : 'bg-white/40 border-gray-200/50'
            } backdrop-blur-md`}>
                <div className="flex flex-row space-x-1">
                    {navItems.map((item) => (
                        <Link 
                            to={item.path}
                            key={item.name}
                            className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                                activeItem === item.name 
                                ? `${isDark 
                                    ? 'bg-green-600 text-white font-bold' 
                                    : 'bg-green-400 text-gray-900 font-bold '}`
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
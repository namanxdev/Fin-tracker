import React from 'react';
import NavBar from './NavBar';
import { Landmark, Menu, UserRound } from 'lucide-react';
import ThemeToggle from '../Theme/ThemeToggle';
import useThemeStore from '../../store/themeStore';

function Header() {
    const isDark = useThemeStore((state) => state.isDark());

    return (
        <div 
            className={`block w-full h-20 shadow-md rounded-b-lg backdrop-blur-md transition-colors duration-300 
                ${isDark ? "bg-white/10 text-white" : "bg-white/30 text-black"}`}
        >
            <div className="flex flex-row justify-between items-center h-full px-4">
                <div className="flex flex-row items-center ml-2">
                    <Landmark className={`h-10 w-12 ${isDark ? "text-white" : "text-black"}`} />
                    <h1 className={`text-2xl font-bold ml-2 ${isDark ? "text-green-300" : "text-green-400"}`}>FinTrack</h1>
                </div>
                <NavBar />
                <div className='flex flex-row items-center mr-2 space-x-2'>
                    {/* Toggle Themes */}
                    <div className='mr-4'>
                        <ThemeToggle />
                    </div>
                    <div className="flex flex-row items-center ml-4">
                        <button className={`flex flex-row items-center justify-center p-4 mr-2 shadow-lg rounded-full transition-colors duration-300
                            ${isDark ? "bg-white/20 border-gray-500 hover:border-white" : "bg-white/20 border-gray-300 hover:border-black"}`}
                        >
                            <div>
                                <Menu className={`${isDark ? "text-white" : "text-black"} mr-1.5`} />
                            </div>
                            <div>
                                <UserRound className={`${isDark ? "text-white" : "text-black"}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

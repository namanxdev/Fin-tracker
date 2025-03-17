// src/Components/Layout/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserRound, LogIn, UserPlus, LogOut, Settings } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

function UserMenu() {
    const isDark = useThemeStore((state) => state.isDark());
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            toast.success("Logged out successfully");
        } else {
            toast.error("Logout failed: " + (result.error || "Unknown error"));
        }
        setIsMenuOpen(false);
    };
    
    return (
        <div className="relative" ref={menuRef}>
            <button 
                className={`flex flex-row items-center justify-center p-4 shadow-lg rounded-full border transition-colors duration-300
                    ${isDark 
                        ? "bg-gray-800/40 border-gray-700/50 hover:border-white" 
                        : "bg-white/20 border-gray-300 hover:border-black"}`}
                onClick={toggleMenu}
                aria-label="User menu"
                aria-expanded={isMenuOpen}
            >
                <div>
                    <Menu className={`${isDark ? "text-white" : "text-black"} mr-1.5`} />
                </div>
                <div>
                    <UserRound className={`${isDark ? "text-white" : "text-black"}`} />
                </div>
            </button>

            {isMenuOpen && (
                <div 
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50
                        ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                >
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </Link>
                            <Link 
                                to="/register"
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className={`px-4 py-2 text-sm font-medium border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                {user?.name || "User"}
                            </div>
                            <Link 
                                to="/profile"
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <UserRound className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                            <Link 
                                to="/settings"
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                            <div className={`my-1 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}></div>
                            <button 
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserMenu;
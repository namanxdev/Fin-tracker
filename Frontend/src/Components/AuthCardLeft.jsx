import React from 'react';
import useThemeStore from '../store/themeStore';

function AuthCardLeft() {
    const isDark = useThemeStore((state) => state.isDark());
    
    return (
        <div className="flex h-screen w-1/2">
            {/* Left Side - Image and Content */}
            <div className={`w-full relative flex flex-col items-center justify-center overflow-hidden
                ${isDark 
                    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" 
                    : "bg-gradient-to-br from-emerald-50 via-white to-emerald-100"}`
            }>
                {/* Background pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className={`absolute w-96 h-96 rounded-full blur-3xl -top-20 -left-20
                        ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`}></div>
                    <div className={`absolute w-96 h-96 rounded-full blur-3xl -bottom-20 -right-20
                        ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`}></div>
                </div>
                
                {/* Main content container - reduced space-y to prevent overlap */}
                <div className="z-10 w-4/5 flex flex-col items-center space-y-6">
                    {/* App logo/name */}
                    <div className="mb-4">
                        <h1 className={`text-4xl font-bold tracking-tight
                            ${isDark ? "text-white" : "text-gray-800"}`}>FinTrack</h1>
                        <p className={`mt-2
                            ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            Secure banking solutions
                        </p>
                    </div>
                    
                    {/* Improved image container */}
                    <div className="w-full aspect-[16/9] relative rounded-xl shadow-2xl overflow-hidden">
                        <img
                            src={isDark ? "/Banking_money.jpg" : "/Analytics.jpg"}
                            alt="Finance Illustration"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    </div>
                    
                    {/* Testimonial with reduced top margin */}
                    <div className={`mt-4 p-4 rounded-lg backdrop-blur-sm
                        ${isDark 
                            ? "bg-black/30 border border-emerald-950/50" 
                            : "bg-white/70 border border-emerald-100"}`}>
                        <p className={`italic
                            ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            "Managing finances has never been easier with this platform."
                        </p>
                        <p className={`text-sm mt-2
                            ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            — John Smith, Customer since 2023
                        </p>
                    </div>
                </div>
                
                {/* Footer */}
                <div className={`absolute bottom-6 text-xs
                    ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    © 2025 FinTrack. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default AuthCardLeft;
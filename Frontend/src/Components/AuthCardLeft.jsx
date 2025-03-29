import React from 'react';
import useThemeStore from '../store/themeStore';

function AuthCardLeft() {
    const isDark = useThemeStore((state) => state.isDark());
    
    return (
        <div className="flex flex-col w-full lg:w-1/2 min-h-[30vh] lg:min-h-full">
            {/* Left Side - Image and Content */}
            <div className={`w-full h-full relative flex flex-col items-center justify-center overflow-hidden py-6 lg:py-10
                ${isDark 
                    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" 
                    : "bg-gradient-to-br from-emerald-50 via-white to-emerald-100"}`
            }>
                {/* Background pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl -top-20 -left-20
                        ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`}></div>
                    <div className={`absolute w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl -bottom-20 -right-20
                        ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`}></div>
                </div>
                
                {/* Main content container - more flexible spacing */}
                <div className="z-10 w-[90%] md:w-4/5 flex flex-col items-center space-y-4 md:space-y-6 py-4 md:py-6">
                    {/* App logo/name */}
                    <div className="mb-2 md:mb-4">
                        <h1 className={`text-2xl md:text-4xl font-bold tracking-tight
                            ${isDark ? "text-white" : "text-gray-800"}`}>FinTrack</h1>
                        <p className={`mt-1 md:mt-2 text-sm md:text-base
                            ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            Secure banking solutions
                        </p>
                    </div>
                    
                    {/* Improved image container with max height - display smaller on mobile */}
                    <div className="w-full max-h-40 md:max-h-60 lg:max-h-80 relative rounded-xl shadow-2xl overflow-hidden">
                        <img
                            src={isDark ? "/Banking_money.jpg" : "/Analytics.jpg"}
                            alt="Finance Illustration"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    
                    {/* Testimonial - only show on larger screens */}
                    <div className={`mt-4 p-3 md:p-4 rounded-lg backdrop-blur-sm max-w-md hidden md:block
                        ${isDark 
                            ? "bg-black/30 border border-emerald-950/50" 
                            : "bg-white/70 border border-emerald-100"}`}>
                        <p className={`italic text-sm md:text-base
                            ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            "Managing finances has never been easier with this platform."
                        </p>
                        <p className={`text-xs md:text-sm mt-2
                            ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            — John Smith, Customer since 2023
                        </p>
                    </div>
                </div>
                
                {/* Footer - positioned better for scrollable content */}
                <div className={`w-full text-center mt-auto pt-2 md:pt-4 text-[10px] md:text-xs
                    ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    © {new Date().getFullYear()} FinTrack. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default AuthCardLeft;
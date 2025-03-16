import React from 'react';
import { Link } from 'react-router-dom';
import useThemeStore from '../store/themeStore';

function AuthCardRight({ children, title, subtitle, footerText, linkText, linkTo }) {
  // Fix: Call isDark as a function
  const isDark = useThemeStore((state) => state.isDark());

  return (
    <div className={`w-1/2 flex flex-col items-center justify-center px-8 py-12 relative
      ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      
      {/* Top decorative element */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full
        ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}></div>
      
      {/* Main content container */}
      <div className="w-full max-w-md z-10">
        {/* Header section */}
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold 
            ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          <p className={`mt-2
            ${isDark ? 'text-green-300' : 'text-green-600'}`}>{subtitle}</p>
        </div>
        
        {/* Form container */}
        <div className={`rounded-xl shadow-md p-6 border
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'}`}>
          {children}
        </div>
        
        {/* Footer with link */}
        <div className="mt-6 text-center">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {footerText}{' '}
            <Link to={linkTo} className={`font-medium transition-colors
              ${isDark 
                ? 'text-emerald-400 hover:text-emerald-300' 
                : 'text-emerald-600 hover:text-emerald-700'}`}>
              {linkText}
            </Link>
          </p>
        </div>
        
        {/* Feature bullets */}
        <div className="mt-12">
          <h3 className={`text-sm font-medium mb-3
            ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            FinTrack offers:
          </h3>
          <ul className="space-y-2">
            {['Secure financial tracking', 'Easy budget management', 'Comprehensive financial insights'].map((feature, index) => (
              <li key={index} className={`flex items-center text-sm
                ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg 
                  className={`h-4 w-4 mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20">
                  <path fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Bottom decorative element */}
      <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-tr-full
        ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}></div>
    </div>
  );
}

export default AuthCardRight;
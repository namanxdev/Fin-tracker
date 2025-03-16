import React from 'react';
import { Link } from 'react-router-dom';


function AuthCardRight({ children, title, subtitle, footerText, linkText, linkTo }) {
  return (
    <div className="w-1/2 bg-white flex flex-col items-center justify-center px-8 py-12 relative">
      {/* Top decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full"></div>
      
      {/* Main content container */}
      <div className="w-full max-w-md z-10">
        {/* Header section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        
        {/* Form container */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {children}
        </div>
        
        {/* Footer with link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {footerText} {' '}
            <Link to={linkTo} className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              {linkText}
            </Link>
          </p>
        </div>
        
        {/* Feature bullets */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-gray-700 mb-3">FinTrack offers:</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure financial tracking
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Easy budget management
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comprehensive financial insights
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100 rounded-tr-full"></div>
    </div>
  );
}

export default AuthCardRight;
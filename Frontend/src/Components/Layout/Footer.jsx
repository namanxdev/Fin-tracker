import React from 'react';
import { Link } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';

const Footer = () => {
  const isDark = useThemeStore((state) => state.isDark());

  return (
    <footer 
      className={`relative pt-8 pb-8 overflow-hidden ${
        isDark
          ? 'bg-[#020617]'
          : 'bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
      }`}
    >
      {/* Subtle grid background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_24px]' 
          : 'bg-[linear-gradient(to_right,#f0f0f01a_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f01a_1px,transparent_1px)] bg-[size:6rem_4rem]'
      }`}></div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center mr-2`}>
                <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>F</span>
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Fin<span className="text-emerald-500">Track</span>
              </span>
            </Link>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your all-in-one finance management solution.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Product</h3>
            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <li><Link to="/features" className="hover:text-emerald-500 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-500 transition-colors">Pricing</Link></li>
              <li>
                <a 
                  href="#faq" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-500 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Company</h3>
            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li><a href="https://github.com/namanxdev" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">About Us</a></li>
              <li><a href='https://www.linkedin.com/in/naman411/' target='_blank' className="hover:text-emerald-500 transition-colors">Contact</a></li>
              <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Legal</h3>
            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <li><Link to="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-emerald-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright and social */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row justify-between items-center ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`mb-4 sm:mb-0 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </div>
          <div className="flex space-x-4">
            {/* Social Media Icons */}
            
            <a href="#" aria-label="Twitter" className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-white/10 hover:text-white' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/naman411/" aria-label="LinkedIn" className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-white/10 hover:text-white' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
            <a href="https://github.com/namanxdev" aria-label="GitHub" className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-white/10 hover:text-white' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative blurred element */}
      <div className={`absolute bottom-0 right-0 w-64 h-64 rounded-full ${
        isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/3'
      } blur-3xl pointer-events-none`}></div>
    </footer>
  );
};

export default Footer;
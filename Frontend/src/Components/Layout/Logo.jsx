import React from 'react'
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
function Logo() {
  const isDark = useThemeStore(state => state.isDark());
  return (
    <div>
         <Link 
                      to="/" 
                      className="flex flex-row items-center ml-2 transition-transform hover:scale-105"
                    >
                        <Landmark className={`h-10 w-12 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                        
                        <h1 className={`text-2xl font-bold ml-2 ${isDark?'text-white':'text-black'}`}>Fin
                            <span className={`${isDark ? "text-emerald-300" : "text-emerald-600"}`}>Track</span>
                        </h1>
        </Link>
    </div>
  )
}

export default Logo
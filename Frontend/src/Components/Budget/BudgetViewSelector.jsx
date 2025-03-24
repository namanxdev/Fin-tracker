import React from 'react';
import useThemeStore from '../../store/themeStore';

function BudgetViewSelector({ activeView, setActiveView }) {
    const isDark = useThemeStore(state => state.isDark());
    
    return (
        <div className="flex justify-center mt-4">
            <div className={`view-selector flex flex-row items-center rounded-full p-1.5 shadow-md mx-auto border relative overflow-hidden
                ${isDark 
                    ? 'bg-gray-900/30 border border-gray-600 shadow-orange-900/20' 
                    : 'bg-white/20 border border-gray-300 shadow-orange-600/10'
                } backdrop-blur-sm`}>
                <div className="view-glow-1"></div>
                <div className="view-glow-2"></div>
                
                <div className="flex flex-row space-x-1 z-10">
                    <button
                        onClick={() => setActiveView('graphs')}
                        className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                            activeView === 'graphs' 
                            ? `${isDark 
                                ? 'bg-orange-600/80 text-white font-bold shadow-lg shadow-orange-900/30' 
                                : 'bg-orange-400/80 text-gray-900 font-bold shadow-lg shadow-orange-600/20'}`
                            : `${isDark 
                                ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                        }`}
                    >
                        Budget Overview
                    </button>
                    <button 
                        onClick={() => setActiveView('transactions')}
                        className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                            activeView === 'transactions' 
                            ? `${isDark 
                                ? 'bg-orange-600/80 text-white font-bold shadow-lg shadow-orange-900/30' 
                                : 'bg-orange-400/80 text-gray-900 font-bold shadow-lg shadow-orange-600/20'}`
                            : `${isDark 
                                ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                        }`}
                    >
                        Manage Budgets
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BudgetViewSelector;
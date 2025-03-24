import React from 'react';
import useThemeStore from '../../store/themeStore';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { getPeriodDisplay } from '../Theme/ThemeIcons';

function BudgetSummaryCards({ totalBudget, totalSpent, remainingBudget, utilizationPercentage, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Enhanced calculation explanation
    const explanations = React.useMemo(() => {
        return {
            total: `Total budget allocated for ${getPeriodDisplay(selectedPeriod)} period`,
            spent: `Total amount spent during this ${getPeriodDisplay(selectedPeriod)} period`,
            remaining: remainingBudget >= 0 
                ? `Amount still available to spend` 
                : `Amount you've exceeded your budget by`,
            percentage: `${utilizationPercentage.toFixed(1)}% of your budget has been utilized`
        };
    }, [selectedPeriod, remainingBudget, utilizationPercentage]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
            } relative overflow-hidden group`}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-all"></div>
                <div className="absolute right-3 top-4 opacity-40 group-hover:opacity-60 transition-opacity">
                    <DollarSign size={24} className="text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Total Budget</h3>
                <p className="text-3xl font-bold mb-2">${totalBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{explanations.total}</p>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
            } relative overflow-hidden group`}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all"></div>
                <div className="absolute right-3 top-4 opacity-40 group-hover:opacity-60 transition-opacity">
                    <BarChart3 size={24} className="text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-purple-500">Total Spent</h3>
                <p className="text-3xl font-bold mb-2">${totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{explanations.spent}</p>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
            } relative overflow-hidden group`}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all"></div>
                <div className="absolute right-3 top-4 opacity-40 group-hover:opacity-60 transition-opacity">
                    {remainingBudget >= 0 ? (
                        <TrendingDown size={24} className="text-green-500" />
                    ) : (
                        <TrendingUp size={24} className="text-red-500" />
                    )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-500">
                    {remainingBudget >= 0 ? 'Remaining Budget' : 'Budget Deficit'}
                </h3>
                <p className={`text-3xl font-bold mb-2 ${remainingBudget < 0 ? 'text-red-500' : ''}`}>
                    ${Math.abs(remainingBudget).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{explanations.remaining}</p>
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h3 className="text-lg font-semibold mb-2 text-blue-500">Budget Utilization</h3>
                <p className={`text-3xl font-bold mb-2 ${
                    utilizationPercentage > 100 ? 'text-red-500' : 
                    utilizationPercentage > 80 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                    {utilizationPercentage.toFixed(1)}%
                </p>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2 relative overflow-hidden">
                    <div 
                        className={`h-4 rounded-full ${
                            utilizationPercentage > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-purple-500'
                        }`}
                        style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    >
                        <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                    </div>
                    
                    {/* 100% marker */}
                    <div className="absolute top-0 right-0 h-full w-px bg-red-500"></div>
                    
                    {/* 75% marker */}
                    <div className="absolute top-0 right-1/4 h-full w-px bg-yellow-500"></div>
                    
                    {/* 50% marker */}
                    <div className="absolute top-0 right-1/2 h-full w-px bg-green-500"></div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">{explanations.percentage}</p>
                
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}

export default BudgetSummaryCards;
import React from 'react';
import useThemeStore from '../../store/themeStore';
import { 
    categoryIcons, 
    getCategoryColor, 
    getBudgetStatusColor,
    getBudgetStatusText,
    statusIcons
} from '../Theme/ThemeIcons';
import { RefreshCcw } from 'lucide-react';
function BudgetUtilizationPanel({ budgets, budgetStatuses, selectedPeriod }) {
    const isDark = useThemeStore(state => state.isDark());
    
    // Filter budget statuses by selected period
    const filteredBudgetStatuses = React.useMemo(() => {
        // First, get all budgets for the selected period
        const periodicBudgets = budgets.filter(b => b.period === selectedPeriod);
        
        // Then, filter budget statuses to only include those categories
        return budgetStatuses.filter(status => 
            periodicBudgets.some(budget => budget.category === status.category)
        );
    }, [budgets, budgetStatuses, selectedPeriod]);
    
    return (
        <div className={`p-6 rounded-lg shadow-md h-full flex flex-col ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
            <h3 className="text-xl font-semibold mb-4 text-orange-500 border-b border-gray-700 pb-2 flex-shrink-0">
                Budget Utilization
            </h3>
            
            {/* Add this wrapper div with fixed height and overflow-auto */}
            <div className="overflow-auto flex-grow" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                <div className="space-y-6 pr-2">
                    {filteredBudgetStatuses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <RefreshCcw size={40} className="animate-spin mb-4 text-orange-500" />
                            <p>No budget data available</p>
                            <p className="text-sm mt-1">Create a budget to see utilization</p>
                        </div>
                    ) : (
                        filteredBudgetStatuses.map((status) => {
                            const budget = budgets.find(b => 
                                b.category === status.category && 
                                b.period === selectedPeriod
                            );
                            
                            if (!budget) return null;
                            
                            const percentage = (status.totalSpent / budget.limit) * 100;
                            const formattedPercentage = percentage.toFixed(1);
                            const statusText = getBudgetStatusText(percentage);
                            const statusColorClass = getBudgetStatusColor(percentage);
                            const categoryColor = getCategoryColor(status.category);
                            const icon = categoryIcons[status.category];
                            const statusIcon = statusIcons[statusText] || statusIcons['Under Budget'];
                            const remaining = budget.limit - status.totalSpent;
                            
                            return (
                                <div key={status.budgetId || status.category} className="mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="rounded-full p-1.5" 
                                                style={{ backgroundColor: categoryColor + '30', color: categoryColor }}
                                            >
                                                {icon}
                                            </span>
                                            <span className="font-medium text-base">{status.category}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-full ${
                                                percentage > 100 
                                                    ? isDark 
                                                        ? 'bg-red-900/30 text-red-400' 
                                                        : 'bg-red-50 text-red-700 border border-red-200' 
                                                    : percentage > 80 
                                                        ? isDark 
                                                            ? 'bg-yellow-900/30 text-yellow-400' 
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : isDark 
                                                            ? 'bg-green-900/30 text-green-400' 
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                <span className={isDark 
                                                    ? (percentage > 100 ? 'text-red-500' : percentage > 80 ? 'text-yellow-500' : 'text-green-500')
                                                    : (percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-amber-600' : 'text-emerald-600')
                                                }>
                                                    {statusIcon}
                                                </span>
                                                {statusText}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 text-sm mb-2">
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Budget:</span>
                                            <span className="ml-2 font-semibold">${budget.limit.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Spent:</span>
                                            <span className="ml-2 font-semibold">${status.totalSpent.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 text-sm mb-2">
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Remaining:</span>
                                            <span className={`ml-2 font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                ${Math.abs(remaining).toLocaleString()}
                                                {remaining < 0 ? ' over' : ''}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Utilization:</span>
                                            <span className={`ml-2 font-semibold ${
                                                percentage > 100 ? 'text-red-500' : percentage > 80 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                                {formattedPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
                                            {/* Progress bar */}
                                            <div 
                                                className={`h-2.5 rounded-full ${statusColorClass}`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            >
                                                {/* Gradient overlay for more depth */}
                                                <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
            {/* Move explanation to a sticky footer */}
            {filteredBudgetStatuses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Understanding Budget Utilization</h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-500 space-y-1.5">
                        <li className="flex items-center gap-1.5">
                            <span className={isDark ? "text-green-500" : "text-emerald-600"}>
                                {statusIcons['Under Budget']}
                            </span>
                            <span className={`font-medium ${isDark ? "text-green-500" : "text-emerald-700"}`}>
                                Under Budget:
                            </span> 
                            <span>You have remaining funds</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <span className={isDark ? "text-yellow-500" : "text-amber-600"}>
                                {statusIcons['At Budget']}
                            </span>
                            <span className={`font-medium ${isDark ? "text-yellow-500" : "text-amber-700"}`}>
                                Near Budget:
                            </span> 
                            <span>Approaching your budget limit</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                            <span className={isDark ? "text-red-500" : "text-red-600"}>
                                {statusIcons['Over Budget']}
                            </span>
                            <span className={`font-medium ${isDark ? "text-red-500" : "text-red-700"}`}>
                                Over Budget:
                            </span> 
                            <span>You've exceeded your budget</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default BudgetUtilizationPanel;
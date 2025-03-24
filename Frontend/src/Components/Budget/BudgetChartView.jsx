import React from 'react';
import useThemeStore from '../../store/themeStore';
import BudgetOverview from './BudgetOverview';
import BudgetCategoryChart from './BudgetCategoryChart';
import BudgetTrendChart from './BudgetTrendChart';
import BudgetPeriodChart from './BudgetPeriodChart';
import { 
    BarChart2, 
    PieChart, 
    TrendingUp, 
    Calendar 
} from 'lucide-react';

function BudgetChartView({ 
    chartType, 
    setChartType, 
    refreshTrigger, 
    budgets, 
    budgetStatuses,
    selectedPeriod
}) {
    const isDark = useThemeStore(state => state.isDark());
    
    const renderChart = () => {
        const props = {
            budgets, 
            budgetStatuses,
            selectedPeriod
        };
        
        switch(chartType) {
            case 'category':
                return <BudgetCategoryChart key={`category-${refreshTrigger}`} {...props} />;
            case 'trend':
                return <BudgetTrendChart key={`trend-${refreshTrigger}`} {...props} />;
            case 'period':
                return <BudgetPeriodChart key={`period-${refreshTrigger}`} {...props} />;
            case 'overview':
            default:
                return <BudgetOverview key={`overview-${refreshTrigger}`} {...props} />;
        }
    };
    
    const chartOptions = [
        { id: 'overview', label: 'Overview', icon: <BarChart2 size={18} /> },
        { id: 'category', label: 'Categories', icon: <PieChart size={18} /> },
        { id: 'trend', label: 'Trends', icon: <TrendingUp size={18} /> },
        { id: 'period', label: 'Periods', icon: <Calendar size={18} /> }
    ];
    
    return (
        <div>
            {renderChart()}
            
            <div className="mt-8 flex justify-center">
                <div className={`inline-flex rounded-xl shadow-md p-1.5 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                    {chartOptions.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setChartType(option.id)}
                            className={`
                                flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium
                                transition-all duration-200 ease-in-out
                                ${chartType === option.id 
                                    ? 'bg-gradient-to-r from-orange-500 to-purple-500 text-white shadow-lg' 
                                    : isDark 
                                        ? 'text-gray-300 hover:bg-gray-700' 
                                        : 'text-gray-700 hover:bg-gray-300'
                                }
                                ${chartType === option.id 
                                    ? 'transform scale-105' 
                                    : ''
                                }
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                                sm:text-xs md:text-sm
                            `}
                            aria-current={chartType === option.id ? 'page' : undefined}
                        >
                            <span className={chartType === option.id ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {option.icon}
                            </span>
                            <span className="hidden sm:inline">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BudgetChartView;
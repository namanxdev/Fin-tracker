import { useState, useCallback, useEffect } from 'react';
import BudgetForm from '../Components/Budget/BudgetForm';
import BudgetManage from '../Components/Budget/BudgetManage';
import useBudgetStore from '../store/budgetStore';
import useThemeStore from '../store/themeStore';
import BudgetViewSelector from '../Components/Budget/BudgetViewSelector';
import BudgetSummaryCards from '../Components/Budget/BudgetSummaryCards';
import BudgetChartView from '../Components/Budget/BudgetChartView';
import BudgetUtilizationPanel from '../Components/Budget/BudgetUtilizationPanel';
import { 
    Calendar, RefreshCw, PiggyBank, BarChart3, Gauge, Coins, 
    AlertOctagon, Info, BarChart 
} from 'lucide-react';
import { getPeriodDisplay } from '../Components/Theme/ThemeIcons';

function BudgetPage() {
    const isDark = useThemeStore((state) => state.isDark());
    const { 
        getBudgets, 
        getBudgetStatuses,
        budgets,
        budgetStatuses,
        uiState,
        updateUiState,
        isLoading,
        isNewUser,
        checkNewUserStatus
    } = useBudgetStore();
    
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeView, setActiveView] = useState('graphs');
    const [chartType, setChartType] = useState('overview');
    
    useEffect(() => {
        const fetchData = async () => {
            await getBudgets();
            await getBudgetStatuses();
            await checkNewUserStatus();
        };
        
        fetchData();
    }, [getBudgets, getBudgetStatuses, checkNewUserStatus, refreshTrigger]);
    
    const handleBudgetAdded = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Calculate summary data for cards (filtered by selected period)
    const filteredBudgets = budgets.filter(budget => 
        budget.period === uiState.selectedPeriod
    );
    
    const totalBudget = filteredBudgets.reduce((total, budget) => 
        total + budget.limit, 0);
    
    // Calculate total spent for the selected period's budgets only
    const totalSpent = budgetStatuses.reduce((total, status) => {
        const matchingBudget = filteredBudgets.find(b => b.category === status.category);
        if (matchingBudget) {
            return total + status.totalSpent;
        }
        return total;
    }, 0);
    
    const remainingBudget = totalBudget - totalSpent;
    const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // New User View - Guide and form
    if (isNewUser) {
        return (
            <div className="space-y-6 container mx-auto px-4">
                <div className={`p-8 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* New user content - no changes needed here */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <PiggyBank size={28} className="text-blue-500" />
                        </div>
                        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            Welcome to Budget Planning
                        </h1>
                        <p className={`max-w-lg mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Create budgets to manage your spending and reach your financial goals.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <Coins size={24} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Set Spending Limits</h3>
                            <p className="text-sm mb-2">Create budgets for different expense categories</p>
                        </div>
                        
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <BarChart size={24} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Track Performance</h3>
                            <p className="text-sm mb-2">See how your actual spending compares to your budget</p>
                        </div>
                        
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <Gauge size={24} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Stay on Target</h3>
                            <p className="text-sm mb-2">Get insights to help you stay within your budget</p>
                        </div>
                    </div>
                    
                    <div className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-blue-200 bg-blue-50'} mb-8`}>
                        <div className="flex items-start">
                            <Info size={20} className={`mt-1 mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <div>
                                <h3 className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Getting Started</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Create your first budget below. Select a category, set an amount limit, and choose a time period. 
                                    Once you have budgets set up, you'll see visualizations of your spending against your budgets.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`p-6 rounded-lg border-2 ${isDark ? 'border-blue-600/30 bg-gray-700/50' : 'border-blue-500/30 bg-white'}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Create Your First Budget
                        </h2>
                        <BudgetForm mode="create" onBudgetAdded={handleBudgetAdded} />
                    </div>
                </div>
            </div>
        );
    }
    
    // Regular View (existing user) - FIXED HTML STRUCTURE
    return (
        <div className="space-y-6">
            {/* View Selection Bar */}
            <BudgetViewSelector 
                activeView={activeView} 
                setActiveView={setActiveView} 
            />

            {/* Main Content Area */}
            <div className='container mx-auto'>
                {/* Period & Refresh Controls */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {getPeriodDisplay(uiState.selectedPeriod)} Budget Overview
                        </span>
                        <button
                            onClick={handleRefresh}
                            className={`ml-3 p-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                            title="Refresh data"
                            disabled={isLoading}
                        >
                            <RefreshCw 
                                size={16} 
                                className={`
                                    ${isLoading ? 'animate-spin' : ''} 
                                    ${isDark ? 'text-gray-300' : 'text-gray-600'}
                                    ${isLoading ? 'opacity-70' : 'opacity-100'}
                                `} 
                            />
                        </button>
                    </div>
                        
                    <div className={`flex items-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        <Calendar size={18} className="mr-2" />
                        <select 
                            value={uiState.selectedPeriod}
                            onChange={(e) => updateUiState({ selectedPeriod: e.target.value })}
                            className={`select select-bordered select-sm rounded-2xl ${
                                isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                            }`}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>
                    
                {/* Budget Summary Cards */}
                <BudgetSummaryCards 
                    totalBudget={totalBudget}
                    totalSpent={totalSpent}
                    remainingBudget={remainingBudget}
                    utilizationPercentage={utilizationPercentage}
                    selectedPeriod={uiState.selectedPeriod}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <RefreshCw size={40} className="animate-spin mb-4 text-orange-500" />
                            <p className={isDark ? 'text-white' : 'text-gray-800'}>Loading budget data...</p>
                        </div>
                    </div>
                ) : activeView === 'graphs' ? (
                    <div className='space-y-8'>
                        {/* Graphs View with 8:4 layout */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-9">
                                <BudgetChartView
                                    chartType={chartType}
                                    setChartType={setChartType}
                                    refreshTrigger={refreshTrigger}
                                    budgets={budgets}
                                    budgetStatuses={budgetStatuses}
                                    selectedPeriod={uiState.selectedPeriod}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-3">
                                <BudgetUtilizationPanel 
                                    budgets={budgets}
                                    budgetStatuses={budgetStatuses}
                                    selectedPeriod={uiState.selectedPeriod}
                                />
                            </div>
                        </div>
                        
                        {/* Form Section */}
                        <div className={`container p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Create New Budget
                            </h2>
                            <BudgetForm mode="create" onBudgetAdded={handleBudgetAdded} />
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-lg shadow-md p-5 ${
                        isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
                    }`}>
                        <h2 className={`text-xl font-semibold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Manage Budgets
                        </h2>
                        <BudgetManage 
                            refreshTrigger={refreshTrigger}
                            onBudgetUpdated={handleBudgetAdded}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default BudgetPage;
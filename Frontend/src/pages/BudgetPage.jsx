import { useState, useCallback, useEffect } from 'react';
import BudgetForm from '../Components/Budget/BudgetForm';
import BudgetManage from '../Components/Budget/BudgetManage';
import useBudgetStore from '../store/budgetStore';
import useThemeStore from '../store/themeStore';
import BudgetViewSelector from '../Components/Budget/BudgetViewSelector';
import BudgetSummaryCards from '../Components/Budget/BudgetSummaryCards';
import BudgetChartView from '../Components/Budget/BudgetChartView';
import BudgetUtilizationPanel from '../Components/Budget/BudgetUtilizationPanel';
import { Calendar, RefreshCw } from 'lucide-react';
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
        isLoading
    } = useBudgetStore();
    
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeView, setActiveView] = useState('graphs');
    const [chartType, setChartType] = useState('overview');
    
    useEffect(() => {
        const fetchData = async () => {
            await getBudgets();
            await getBudgetStatuses();
        };
        
        fetchData();
    }, [getBudgets, getBudgetStatuses, refreshTrigger]);
    
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
import { useCallback, useState } from 'react';
import ExpensesForm from '../Components/Expenses/ExpensesForm';
import ExpenseAreaChart from '../Components/Expenses/AreaChart';
import ExpensesPieChart from '../Components/Expenses/ExpensesPieChart';
import ExpenseTransaction from '../Components/Expenses/ExpenseTransaction';
import MonthlySummaryChart from '../Components/Expenses/MonthySummaryChart';
import YearlySummaryChart from '../Components/Expenses/YearlySummaryChart';
import SpecificMonthChart from '../Components/Expenses/SpecificMonthChart';
import DateRangeChart from '../Components/Expenses/DateRangeChart';
import useThemeStore from '../store/themeStore';
import ExpenseCards from '../Components/Expenses/ExpenseCards';

function ExpensesPage() {
    const isDark = useThemeStore((state) => state.isDark());
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeView, setActiveView] = useState('graphs');
    const [chartType, setChartType] = useState('total'); // 'total', 'monthly', 'yearly', 'specific-month', 'date-range'

    const handleExpenseAdded = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);
    
    // Render the appropriate chart based on selection
    const renderChart = () => {
        switch(chartType) {
            case 'monthly':
                return <MonthlySummaryChart key={`monthly-${refreshTrigger}`} />;
            case 'yearly':
                return <YearlySummaryChart key={`yearly-${refreshTrigger}`} />;
            case 'specific-month':
                return <SpecificMonthChart key={`month-${refreshTrigger}`} />;
            case 'date-range':
                return <DateRangeChart key={`range-${refreshTrigger}`} />;
            case 'total':
            default:
                return <ExpenseAreaChart key={`chart-${refreshTrigger}`} />;
        }
    };
    
    return (
        <div className="space-y-6">
            {/* View Selection Bar */}
            <div className="flex justify-center mt-4">
                <div className={`view-selector flex flex-row items-center rounded-full p-1.5 shadow-md mx-auto border relative overflow-hidden
                    ${isDark 
                        ? 'bg-gray-900/30 border border-gray-600 shadow-emerald-900/20' 
                        : 'bg-white/20 border border-gray-300 shadow-emerald-600/10'
                    } backdrop-blur-sm`}>
                    {/* Glow effects */}
                    <div className="view-glow-1"></div>
                    <div className="view-glow-2"></div>
                    
                    <div className="flex flex-row space-x-1 z-10">
                        <button
                            onClick={() => setActiveView('graphs')}
                            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                activeView === 'graphs' 
                                ? `${isDark 
                                    ? 'bg-emerald-600/80 text-white font-bold shadow-lg shadow-emerald-900/30' 
                                    : 'bg-emerald-400/80 text-gray-900 font-bold shadow-lg shadow-emerald-600/20'}`
                                : `${isDark 
                                    ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                    : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                            }`}
                        >
                            Expense Graphs
                        </button>
                        <button 
                            onClick={() => setActiveView('transactions')}
                            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                activeView === 'transactions' 
                                ? `${isDark 
                                    ? 'bg-emerald-600/80 text-white font-bold shadow-lg shadow-emerald-900/30' 
                                    : 'bg-emerald-400/80 text-gray-900 font-bold shadow-lg shadow-emerald-600/20'}`
                                : `${isDark 
                                    ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                    : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                            }`}
                        >
                            Transaction List
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className='container'>
                {activeView === 'graphs' ? (
                    <div className='space-y-8'>
                        {/* Expense Cards */}
                        <ExpenseCards key={`cards-${refreshTrigger}`} />
                        
                        {/* Graphs View with 8:4 layout */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-8">
                                {renderChart()}
                                <div className="mt-4">
                                    <select 
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                        className="select select-primary w-full max-w-xs"
                                    >
                                        <option value="total">Total Expenses</option>
                                        <option value="monthly">Monthly Summary</option>
                                        <option value="yearly">Yearly Summary</option>
                                        <option value="specific-month">Specific Month Summary</option>
                                        <option value="date-range">Date Range Summary</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <ExpensesPieChart key={`pie-${refreshTrigger}`}/>
                            </div>
                        </div>
                        
                        {/* Form Section */}
                        <div className={`container p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Add New Expense
                            </h2>
                            <ExpensesForm onExpenseAdded={handleExpenseAdded}/>
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-lg shadow-md p-5 ${
                        isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
                    }`}>
                        {/* Expense Cards */}
                        <ExpenseCards key={`cards-${refreshTrigger}`} />
                        
                        <h2 className={`text-xl font-semibold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Recent Transactions
                        </h2>
                        <ExpenseTransaction 
                            refreshTrigger={refreshTrigger}
                            onExpenseUpdated={handleExpenseAdded}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExpensesPage;
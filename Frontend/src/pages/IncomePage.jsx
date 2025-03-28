import { useState, useCallback, useEffect } from 'react';
import IncomeForm from '../Components/Income/IncomeForm';
import IncomeAreaChart from '../Components/Income/IncomeAreaChart';
import IncomePieChart from '../Components/Income/IncomePieChart';
import IncomeTransaction from '../Components/Income/IncomeTransaction';
import IncomeCards from '../Components/Income/IncomeCards';
import IncomeDateRangeChart from '../Components/Income/IncomeDateRangeChart';
import useThemeStore from '../store/themeStore';
import useIncomeStore from '../store/incomeStore';
import { PlusCircle, LineChart, ArrowDownCircle, Info, DollarSign } from 'lucide-react';

function IncomePage() {
    const isDark = useThemeStore((state) => state.isDark());
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeView, setActiveView] = useState('graphs');
    const [chartType, setChartType] = useState('total');
    
    // Get isNewUser and check function from store
    const isNewUser = useIncomeStore((state) => state.isNewUser);
    const checkNewUserStatus = useIncomeStore((state) => state.checkNewUserStatus);
    
    // Check if user is new when component mounts
    useEffect(() => {
        checkNewUserStatus();
    }, [checkNewUserStatus]);
    
    const handleIncomeAdded = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
        // Recheck user status when income is added
        checkNewUserStatus();
    }, [checkNewUserStatus]);
    
    const renderChart = () => {
        switch(chartType) {
            case 'monthly':
                return <IncomeAreaChart key={`monthly-${refreshTrigger}`} viewMode="monthly" />;
            case 'yearly':
                return <IncomeAreaChart key={`yearly-${refreshTrigger}`} viewMode="yearly" />;
            case 'date-range':
                return <IncomeDateRangeChart key={`dr-${refreshTrigger}`} />;
            case 'total':
            default:
                return <IncomeAreaChart key={`chart-${refreshTrigger}`} />;
        }
    };
    
    // New User View - Guide and form
    if (isNewUser) {
        return (
            <div className="space-y-6 container mx-auto px-4">
                <div className={`p-8 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <DollarSign size={28} className="text-green-500" />
                        </div>
                        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            Welcome to Income Tracking
                        </h1>
                        <p className={`max-w-lg mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Track and manage all your income sources to get better insights into your finances.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <PlusCircle size={24} className={isDark ? 'text-green-400' : 'text-green-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Add Income</h3>
                            <p className="text-sm mb-2">Record your salary, freelance work, and other income sources</p>
                        </div>
                        
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <LineChart size={24} className={isDark ? 'text-green-400' : 'text-green-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Track Trends</h3>
                            <p className="text-sm mb-2">Analyze income patterns over time with visual charts</p>
                        </div>
                        
                        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} text-center`}>
                            <div className="flex justify-center mb-4">
                                <ArrowDownCircle size={24} className={isDark ? 'text-green-400' : 'text-green-500'} />
                            </div>
                            <h3 className="font-semibold mb-2">Categorize Income</h3>
                            <p className="text-sm mb-2">Group your income by categories for better organization</p>
                        </div>
                    </div>
                    
                    <div className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-green-200 bg-green-50'} mb-8`}>
                        <div className="flex items-start">
                            <Info size={20} className={`mt-1 mr-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            <div>
                                <h3 className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Getting Started</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Start by adding your first income source below. Once you add income entries, you'll see charts and graphs showing your financial progress.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Section - More prominent for new users */}
                    <div className={`p-6 rounded-lg border-2 ${isDark ? 'border-green-600/30 bg-gray-700/50' : 'border-green-500/30 bg-white'}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Add Your First Income
                        </h2>
                        <IncomeForm onIncomeAdded={handleIncomeAdded} />
                    </div>
                </div>
            </div>
        );
    }
    
    // Regular View (existing user) - Keep your current code
    return (
        <div className="space-y-6">
            {/* View Selection Bar */}
            <div className="flex justify-center mt-4">
                {/* Your existing view selector code */}
                <div className={`view-selector flex flex-row items-center rounded-full p-1.5 shadow-md mx-auto border relative overflow-hidden
                    ${isDark 
                        ? 'bg-gray-900/30 border border-gray-600 shadow-blue-900/20' 
                        : 'bg-white/20 border border-gray-300 shadow-blue-600/10'
                    } backdrop-blur-sm`}>
                    {/* Your existing code */}
                    <div className="view-glow-1"></div>
                    <div className="view-glow-2"></div>
                    
                    <div className="flex flex-row space-x-1 z-10">
                        <button
                            onClick={() => setActiveView('graphs')}
                            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                activeView === 'graphs' 
                                ? `${isDark 
                                    ? 'bg-blue-600/80 text-white font-bold shadow-lg shadow-blue-900/30' 
                                    : 'bg-blue-400/80 text-gray-900 font-bold shadow-lg shadow-blue-600/20'}`
                                : `${isDark 
                                    ? 'text-gray-300 font-semibold hover:bg-gray-700/50 hover:text-white' 
                                    : 'text-gray-900 font-semibold hover:bg-gray-200/70 hover:text-gray-900'}`
                            }`}
                        >
                            Income Graphs
                        </button>
                        <button 
                            onClick={() => setActiveView('transactions')}
                            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                activeView === 'transactions' 
                                ? `${isDark 
                                    ? 'bg-blue-600/80 text-white font-bold shadow-lg shadow-blue-900/30' 
                                    : 'bg-blue-400/80 text-gray-900 font-bold shadow-lg shadow-blue-600/20'}`
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

            {/* Your existing content code */}
            <div className='container mx-auto'>
                {activeView === 'graphs' ? (
                    <div className='space-y-8'>
                        {/* Income Cards */}
                        <IncomeCards key={`cards-${refreshTrigger}`} />
                        
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
                                        <option value="total">Total Income</option>
                                        <option value="monthly">Monthly Summary</option>
                                        <option value="yearly">Yearly Summary</option>
                                        <option value="date-range">Date Range Summary</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                                <IncomePieChart key={`pie-${refreshTrigger}`}/>
                            </div>
                        </div>
                        
                        {/* Form Section */}
                        <div className={`container p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Add New Income
                            </h2>
                            <IncomeForm onIncomeAdded={handleIncomeAdded}/>
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-lg shadow-md p-5 ${
                        isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
                    }`}>
                        {/* Income Cards */}
                        <IncomeCards key={`cards-${refreshTrigger}`} />
                        
                        <h2 className={`text-xl font-semibold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Income Transactions
                        </h2>
                        <IncomeTransaction 
                            refreshTrigger={refreshTrigger}
                            onIncomeUpdated={handleIncomeAdded}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default IncomePage;
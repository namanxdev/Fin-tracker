import { useState, useCallback } from 'react';
import IncomeForm from '../Components/Income/IncomeForm';
import IncomeAreaChart from '../Components/Income/IncomeAreaChart';
import IncomePieChart from '../Components/Income/IncomePieChart';
import IncomeTransaction from '../Components/Income/IncomeTransaction';
import IncomeCards from '../Components/Income/IncomeCards';
import IncomeDateRangeChart from '../Components/Income/IncomeDateRangeChart';
import useThemeStore from '../store/themeStore';

function IncomePage() {
    const isDark = useThemeStore((state) => state.isDark());
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeView, setActiveView] = useState('graphs');
    const [chartType, setChartType] = useState('total');
    
    const handleIncomeAdded = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);
    
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
    
    return (
        <div className="space-y-6">
            {/* View Selection Bar */}
            <div className="flex justify-center mt-4">
                <div className={`view-selector flex flex-row items-center rounded-full p-1.5 shadow-md mx-auto border relative overflow-hidden
                    ${isDark 
                        ? 'bg-gray-900/30 border border-gray-600 shadow-blue-900/20' 
                        : 'bg-white/20 border border-gray-300 shadow-blue-600/10'
                    } backdrop-blur-sm`}>
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

            {/* Main Content Area */}
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
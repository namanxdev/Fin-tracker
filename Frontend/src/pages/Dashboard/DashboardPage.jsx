import React, { useEffect, useState, useCallback } from 'react';
import { 
  CreditCard, 
  Banknote, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import useDashboardStore from '../../store/dashboardStore';
import useThemeStore from '../../store/themeStore';
import SummaryCard from '../../components/Dashboard/SummaryCard';
import CashFlowChart from '../../components/Dashboard/CashFlowChart';
import SavingsAnalysis from '../../components/Dashboard/SavingsAnalysis';
import BudgetPerformance from '../../components/Dashboard/BudgetPerformance';
import TopCategoriesChart from '../../components/Dashboard/TopCategoriesChart';
import DashboardCard from '../../components/Dashboard/DashboardCard';
import DashboardTips from '../../Components/Dashboard/DashboardTips';
import UpcomingBills from '../../Components/Dashboard/UpcomingBills';

function DashboardPage() {
  const isDarkMode = useThemeStore(state => state.isDark());
  const { 
    summaryData, 
    cashFlowData,
    savingsData,
    budgetPerformance,
    isLoading,
    getDashboardSummary,
    getCashFlow,
    getSavingsAnalysis,
    getBudgetPerformance
  } = useDashboardStore();
  
  const [timeRange, setTimeRange] = useState({
    cashFlow: 6,
    savings: 12
  });

  // Load data based on current timeRange
  const loadData = useCallback(async () => {
    await getDashboardSummary();
    await getCashFlow(timeRange.cashFlow);
    await getSavingsAnalysis(timeRange.savings);
    await getBudgetPerformance();
  }, [getDashboardSummary, getCashFlow, getSavingsAnalysis, getBudgetPerformance, timeRange]);

  useEffect(() => {
    // Load all dashboard data when the component mounts or timeRange changes
    loadData();
  }, [loadData]);

  // Handler for cash flow period changes
  const handleCashFlowPeriodChange = async (newMonths) => {
    setTimeRange(prev => ({ ...prev, cashFlow: newMonths }));
    // You can also choose to immediately fetch just the cash flow data
    await getCashFlow(newMonths);
  };

  // Handler for savings period changes (if needed)
  const handleSavingsPeriodChange = async (newMonths) => {
    setTimeRange(prev => ({ ...prev, savings: newMonths }));
    await getSavingsAnalysis(newMonths);
  };

  return (
    <div className="container px-4 mx-auto pt-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-2">
        <h1 className="text-3xl font-bold text-center sm:text-left bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Financial Dashboard</h1>
        <div className={`px-4 py-1 ${isDarkMode ? 'bg-blue-500 text-gray-200' : 'bg-blue-400 text-gray-800'} rounded-full shadow-sm`}>
          <p className="text-sm font-medium !p-3">
            {summaryData?.currentMonth ? `Data for ${summaryData.currentMonth}` : 'Loading data...'}
          </p>
        </div>
      </div>

      {/* Summary Cards Row - Improved spacing and responsiveness */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8  p-4 rounded-lg shadow-md`}>
        <SummaryCard
          title="Monthly Income"
          amount={summaryData?.income || 0}
          icon={<Banknote className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />}
          trend={10} // Example trend value
          className={`border-l-4 ${isDarkMode ? 'border-blue-600' : 'border-blue-500'}`}
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={summaryData?.expenses || 0}
          icon={<CreditCard className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />}
          trend={-5} // Example trend value
          className={`border-l-4 ${isDarkMode ? 'border-red-600' : 'border-red-500'}`}
        />
        <SummaryCard
          title="Monthly Savings"
          amount={summaryData?.savings || 0}
          icon={<TrendingUp className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />}
          trend={15} // Example trend value
          className={`border-l-4 ${isDarkMode ? 'border-green-600' : 'border-green-500'}`}
        />
        <SummaryCard
          title="Active Budgets"
          amount={summaryData?.budgetCount || 0}
          icon={<BarChart3 className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />}
          trend={null} // No trend for budget count
          className={`border-l-4 ${isDarkMode ? 'border-purple-600' : 'border-purple-500'}`}
          prefix=""
        />
      </div>

      {/* Main Dashboard Grid - Improved spacing and box shadows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* First Column - Cash Flow Chart (Spans 2 columns) */}
        <div className="lg:col-span-2">
          <CashFlowChart 
            data={cashFlowData} 
            loading={isLoading && !cashFlowData} 
            months={timeRange.cashFlow}
            onPeriodChange={handleCashFlowPeriodChange}
          />
        </div>

        {/* Second Column - Top Spending Categories */}
        <div>
          <TopCategoriesChart 
            data={summaryData} 
            loading={isLoading && !summaryData} 
          />
        </div>

        {/* Third Column - Budget Performance */}
        <div>
          <BudgetPerformance 
            data={budgetPerformance} 
            loading={isLoading && !budgetPerformance} 
          />
        </div>

        {/* Fourth Column - Savings Analysis (Spans 2 columns) */}
        <div className="lg:col-span-2">
          <SavingsAnalysis 
            data={savingsData} 
            loading={isLoading && !savingsData} 
          />
        </div>
      </div>

      {/* Additional row with improved spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8">
        <DashboardCard title="Financial Tips" fullHeight>
            <DashboardTips />
        </DashboardCard>
        
        <DashboardCard title="Upcoming Bills" fullHeight>
          <UpcomingBills/>
        </DashboardCard>
      </div>
    </div>
  );
}

export default DashboardPage;
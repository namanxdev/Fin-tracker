import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useThemeStore  from '../../store/themeStore';
import useExpenseStore from '../../store/expenseStore';
import useDashboardStore from '../../store/dashboardStore';
import useUpcomingBills from './UseUpcomingBills';
import BillItem from './BillItem';
import { PlusCircle } from 'lucide-react';

function UpcomingBills() {
  const isDark = useThemeStore(state => state.isDark());
  const { expenses, getExpenses, isLoading } = useExpenseStore();
  const isNewUser = useDashboardStore(state => state.isNewUser);

  useEffect(() => {
    if (expenses.length === 0 && !isLoading && !isNewUser)  getExpenses();
      }, [expenses.length, isLoading, getExpenses]);

  const upcomingBills = useUpcomingBills(expenses);

  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center h-50'>
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : upcomingBills.length > 0 ? (
        <div>
          <ul className="space-y-4 mt-4">
            {upcomingBills.map(bill => <BillItem key={bill.id} bill={bill} isDark={isDark} />)}
          </ul>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          {isNewUser ? (
            <>
              <div className="text-5xl mb-3">📅</div>
              <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                No recurring expenses yet
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Add recurring expenses to track upcoming bills here
              </p>
              <Link to="/expenses" className={`flex items-center px-4 py-2 rounded-md text-white ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Recurring Expense
              </Link>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">🎉</div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Great! No upcoming bills due soon.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default UpcomingBills;
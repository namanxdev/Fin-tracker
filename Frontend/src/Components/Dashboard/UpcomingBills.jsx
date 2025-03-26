import React, { useEffect } from 'react';
import  useThemeStore  from '../../store/themeStore';
import useExpenseStore from '../../store/expenseStore';
import useUpcomingBills from './UseUpcomingBills';
import BillItem from './BillItem';


function UpcomingBills() {
  const isDark = useThemeStore(state => state.isDark());
  const { expenses, getExpenses, isLoading } = useExpenseStore()

  useEffect(() => {
    if (expenses.length === 0 && !isLoading) getExpenses();
  }, [expenses.length, isLoading, getExpenses]);

  const upcomingBills = useUpcomingBills(expenses);

  return (
    <div>
      {isLoading ? (
        <div className='flex justify-center items-center h-50'>
          <span className="loading loading-infinity loading-xl"></span>

        </div>
      ) : 1 > 0 ? (
        <div>
          <ul className="space-y-4 mt-4">
            {upcomingBills.map(bill => <BillItem key={bill.id} bill={bill} isDark={isDark} />)}
          </ul>
        </div>
      ) : (
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No upcoming bills found.</p>
      )}
    </div>
  );
}
export default UpcomingBills;
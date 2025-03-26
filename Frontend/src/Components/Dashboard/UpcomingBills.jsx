import React, { useEffect } from 'react';
import  useThemeStore  from '../../store/themeStore';
import useExpenseStore from '../../store/expenseStore';
import useUpcomingBills from './UseUpcomingBills';
import BillItem from './BillItem';
import { shallow } from 'zustand/shallow';


function UpcomingBills() {
  const isDark = useThemeStore(state => state.isDark);
  const { expenses, getExpenses, isLoading } = useExpenseStore()

  useEffect(() => {
    if (expenses.length === 0 && !isLoading) getExpenses();
  }, [expenses.length, isLoading, getExpenses]);

  const upcomingBills = useUpcomingBills(expenses);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : 1 > 0 ? (
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Upcoming Bills</h2>
          <ul className="space-y-4 mt-4">
            {upcomingBills.map(bill => <BillItem key={bill.id} bill={bill} isDark={isDark} />)}
            {/* <h1>Hello</h1> */}
          </ul>
        </div>
      ) : (
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No upcoming bills found.</p>
      )}
    </div>
  );
}
export default UpcomingBills;
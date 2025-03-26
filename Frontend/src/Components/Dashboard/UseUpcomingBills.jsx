import { useMemo } from 'react';

const useUpcomingBills = (expenses) => {
  return useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const today = new Date();

    return expenses
      .filter(expense => expense.isRecurring)
      .map(expense => {
        const expenseDate = new Date(expense.date);
        const nextDueDate = new Date(today.getFullYear(), today.getMonth(), expenseDate.getDate());

        if (nextDueDate < today) {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }

        const daysUntilDue = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
        const colorScheme = daysUntilDue <= 3 ? 'red' : daysUntilDue <= 7 ? 'yellow' : 'blue';

        return { ...expense, nextDueDate, daysUntilDue, colorScheme };
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
      .slice(0, 5);
  }, [expenses]);
};

export default useUpcomingBills;
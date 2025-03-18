import ExpensesForm from '../Components/Expenses/ExpensesForm';
import ExpenseAreaChart from '../Components/Expenses/AreaChart';
import ExpensesPieChart from '../Components/Expenses/ExpensesPieChart';
import { useCallback, useState } from 'react';
import { Pie } from 'recharts';

function ExpensesPage() {

    const[refreshTrigger, setRefreshTrigger] = useState(0);

    const handleExpenseAdded = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);
    

    return (
        <div>
            <div className='container'>
                {/* AreaChart */}
                <ExpenseAreaChart key={`chart-${refreshTrigger}`}/>
                <ExpensesPieChart key={`pie-${refreshTrigger}`}/>
            </div>
            <div className='container'>
                {/* Expense Form */}
                <h1 className='text-2xl'>Add Expense</h1>
                <ExpensesForm onExpenseAdded={handleExpenseAdded}/>
            </div>    
        </div>
    );
}

export default ExpensesPage;
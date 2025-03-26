import { Calendar } from 'lucide-react';

// Add this function that was missing
const getBgStyles = (colorScheme, isDark) => {
  const styles = {
    red: {
      border: 'border-l-4 border-red-500',
      bg: isDark ? 'bg-red-800/20' : 'bg-red-100',
    },
    yellow: {
      border: 'border-l-4 border-yellow-500',
      bg: isDark ? 'bg-yellow-800/20' : 'bg-yellow-100',
    },
    blue: {
      border: 'border-l-4 border-blue-500',
      bg: isDark ? 'bg-blue-800/20' : 'bg-blue-100',
    }
  };
  
  return styles[colorScheme] || styles.blue;
};

const BillItem = ({ bill, isDark }) => {
  const { border, bg } = getBgStyles(bill.colorScheme, isDark);

  return (
    <li className={`flex items-center p-4 rounded-lg shadow-sm ${bg} ${border}`}>
      <Calendar className={`h-6 w-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`} />
      <div className="ml-4 flex-grow">
        <p className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{bill.title}</p>
        <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
          Due in {bill.daysUntilDue} days - {bill.paymentMethod}
        </p>
      </div>
      <p className={`font-semibold text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        ${bill.amount.toFixed(2)}
      </p>
    </li>
  );
};

export default BillItem;
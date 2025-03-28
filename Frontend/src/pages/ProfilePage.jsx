import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar,Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useIncomeStore from "../store/incomeStore";
import useExpenseStore from "../store/expenseStore";
import { format } from 'date-fns';


const formatDateTime = (isoString) => {
  // Check if isoString exists and is valid
  if (!isoString) {
    return {
      date: "Not available",
      time: "Not available"
    };
  }

  try {
    const dateObj = new Date(isoString);
    
    // Check if date is valid (Invalid dates return NaN when converted to number)
    if (isNaN(dateObj.getTime())) {
      return {
        date: "Invalid date",
        time: "Invalid time"
      };
    }

    return {
      date: format(dateObj, 'MMMM d, yyyy'),
      time: format(dateObj, 'hh:mm:ss a')
    };
  } catch (error) {
    console.error("Date formatting error:", error);
    return {
      date: "Error formatting date",
      time: "Error formatting time"
    };
  }
};


function ProfilePage() {
  const { user } = useAuthStore();
  const isDark = useThemeStore((state) => state.isDark());
  
  // Get access to store data AND fetch methods
  const incomes = useIncomeStore((state) => state.incomes);
  const expenses = useExpenseStore((state) => state.expenses);
  const getIncomes = useIncomeStore((state) => state.getIncomes);
  const getExpenses = useExpenseStore((state) => state.getExpenses);
  const isLoadingIncome = useIncomeStore((state) => state.isLoading);
  const isLoadingExpense = useExpenseStore((state) => state.isLoading);
  
  // Calculate total transactions from the stored arrays
  const totalTransactions = incomes.length + expenses.length;
  
  // Add this simple check
  const isNewUser = totalTransactions === 0;
  
  // Format dates from user object
  const { date: createdDate } = formatDateTime(user?.createdAt);
  const { date: updatedDate, time: updatedTime } = formatDateTime(user?.updatedAt);
  
  // Fetch data when component mounts
  useEffect(() => {
    // Only fetch if arrays are empty
    if (incomes.length === 0 && !isLoadingIncome && !isNewUser) {
      getIncomes();
    }
    if (expenses.length === 0 && !isLoadingExpense && !isNewUser) {
      getExpenses();
    }
  }, [incomes.length, expenses.length, isLoadingIncome, isLoadingExpense, getIncomes, getExpenses]);
  
  // Updated account stats with proper calculation
  const accountStats = {
    memberSince: createdDate,
    totalTransactions: totalTransactions,
    lastLogin: updatedTime,
    lastLoginDate: updatedDate,
  };
  
  const AvatarSVG = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
  
    return (
      <svg width="100" height="100" viewBox="0 0 48 48" className="rounded-full">
        <circle cx="24" cy="24" r="24" fill="#4F46E5" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          {initial}
        </text>
      </svg>
    );
  };
  


  // Usage
  <AvatarSVG name="Alice" />;
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                  <span className="text-3xl">
                    <AvatarSVG name={user?.name} />
                  </span>
                </div>
              </div>
              <h2 className="card-title text-2xl">{user?.name || "User"}</h2>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>{user?.email || "user@example.com"}</p>
              <div className="mt-4 w-full">
                <Link 
                  to="/settings" 
                  className="btn btn-primary btn-outline w-full"
                >
                  <SettingsIcon size={16} className="mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Information */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div className={`flex items-center p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <User className="mr-3" />
                  <div>
                    <div className="text-sm opacity-70">Full Name</div>
                    <div>{user?.name || "User"}</div>
                  </div>
                </div>
                
                <div className={`flex items-center p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <Mail className="mr-3" />
                  <div>
                    <div className="text-sm opacity-70">Email</div>
                    <div>{user?.email || "user@example.com"}</div>
                  </div>
                </div>
                
                <div className={`flex items-center p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <Calendar className="mr-3" />
                  <div>
                    <div className="text-sm opacity-70">Member Since</div>
                    <div>{accountStats.memberSince}</div>
                  </div>
                </div>
              </div>
              
              <div className="divider my-6">Activity</div>
              
              {isNewUser ? (
                <div className={`p-6 rounded-lg text-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <h3 className="text-xl font-semibold mb-3">Welcome to FinTrack!</h3>
                  <p className="mb-4">You haven't recorded any transactions yet. Get started by adding your first income or expense.</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Link to="/income" className="btn btn-primary">
                      Add Income
                    </Link>
                    <Link to="/expenses" className="btn btn-secondary">
                      Add Expense
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="stats stats-vertical shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Total Transactions</div>
                    <div className="stat-value">{accountStats.totalTransactions}</div>
                    <div className="stat-desc">Across the account</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Last Login</div>
                    <div className="stat-value text-lg">{accountStats.lastLoginDate}</div>
                    <div className="stat-desc">Last Updated at {accountStats.lastLogin}</div>
                    <div className="stat-desc">From this device</div>
                  </div>
                </div>
              )}
              
              <div className="card-actions justify-end mt-6">
                <Link to="/settings" className="btn btn-ghost btn-sm">
                  Account Settings
                  <ChevronRight size={16} />
                </Link>
              </div>

              {isNewUser && (
                <div className={`card mt-6 ${isDark ? "bg-gray-800" : "bg-base-100"} shadow-xl`}>
                  <div className="card-body">
                    <h2 className="card-title">
                      <span className="badge badge-accent">New</span> 
                      Getting Started Guide
                    </h2>
                    
                    <ul className="steps steps-vertical mt-4">
                      <li className="step step-primary">Create your account ✓</li>
                      <li className="step">Add your first income</li>
                      <li className="step">Record your expenses</li>
                      <li className="step">Set up a monthly budget</li>
                    </ul>
                    
                    <div className="card-actions justify-end mt-4">
                      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

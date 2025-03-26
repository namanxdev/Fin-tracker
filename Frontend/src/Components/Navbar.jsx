import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
            {isAuthenticated && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/expenses">Expenses</Link></li>
                <li><Link to="/income">Income</Link></li>
                <li><Link to="/budget">Budget</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">Financer</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/expenses">Expenses</Link></li>
            <li><Link to="/income">Income</Link></li>
            <li><Link to="/budget">Budget</Link></li>
          </ul>
        )}
      </div>
      
      <div className="navbar-end">
        {isAuthenticated ? (
          <>
            <Link to="/settings" className="btn btn-ghost btn-circle">
              <SettingsIcon size={20} />
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost">
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-ghost">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

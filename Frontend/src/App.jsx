import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import HomePage from './pages/HomePage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Settings from './pages/Settings';

// TODO:  add payment methods 
const ProtectedRoute = ({children}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  
  // Show loading indicator while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  // Only redirect when we're sure the user isn't authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Create a layout component to handle the location check
const AppLayout = () => {
  const location = useLocation();
  const isDark = useThemeStore((state) => state.isDark());
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background for dark and light modes - only shown on non-homepage routes */}
      {!isHomePage && (
        <>
          {isDark ? (
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
          ) : (
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
          )}
        </>
      )}

      <Header />
      <main className="flex-grow">
        {/* Use Outlet instead of nested Routes */}
        <Outlet />
      </main>
      {/* Only render footer if NOT on auth pages */}
      {/* {!isAuthPage && <Footer />} */}
      <Footer/>
    </div>
  );
};


function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  
  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          success: {
            style: {
              background: '#10b981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
        }}
      />
      <Router>
        <Routes>
          {/* Proper nested routes structure */}
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            } />
            <Route path="/income" element={
              <ProtectedRoute>
                <IncomePage />
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            {/* Catch-all route */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
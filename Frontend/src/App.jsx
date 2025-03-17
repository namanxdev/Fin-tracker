import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Components/Layout/Header';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({children}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const isDark = useThemeStore((state) => state.isDark());
  
  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />
      <Router>
        <Header />
        <main className={`min-h-screen pt-4 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
          <div className="w-full px-8 sm:px-12 lg:px-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={< RegisterPage/>} />
              
              {/* Protected Routes */}
{/*     {/* <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } /> */}
              {/* Add other routes */}
            </Routes>
          </div>
        </main>
      </Router>
    </>
  )
}

export default App
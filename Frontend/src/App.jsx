import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// Create a layout component to handle the location check
const AppLayout = () => {
  const location = useLocation();
  const isDark = useThemeStore((state) => state.isDark());
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      <Header />
      {isHomePage ? (
        // For homepage, use full width without extra containers
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      ) : (
        // For other pages, use the styled container
        <main className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage/>} />
              
              {/* Protected Routes */}
              {/* <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } /> */}
              {/* Add other routes */}
            </Routes>
          </div>
        </main>
      )}
    </>
  );
}

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
          duration: 3000,
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
        <AppLayout />
      </Router>
    </>
  )
}

export default App
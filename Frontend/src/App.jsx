import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Components/Layout/Header';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';
import { ThemeProvider } from './Components/Theme/ThemeProvider'; 

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
  
  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  return (
    <ThemeProvider> {/* Wrap the entire app with ThemeProvider */}
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={< RegisterPage/>} />

        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
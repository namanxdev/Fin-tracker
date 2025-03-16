import LoginPage from './pages/Auth/LoginPage'
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './Components/Layout/NavBar';
import Header from './Components/Layout/Header';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import { ThemeProvider } from './Components/Theme/ThemeProvider'; // Import ThemeProvider

const ProtectedRoute = ({children}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider> {/* Wrap the entire app with ThemeProvider */}
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
import LoginPage from './pages/Auth/LoginPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/Layout/NavBar';
function App() {
  return (
    <> 
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
    </>
  )
}

export default App

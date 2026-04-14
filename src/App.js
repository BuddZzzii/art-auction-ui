import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// 1. IMPORT THE REAL PAGES (Delete the "const Home" and "const Login" lines)
import BrowsePage from './Pages/BrowsePage'; 
import LoginPage from './Pages/LoginPage';
// import RegisterPage from './Pages/RegisterPage'; // Add this when you're ready!

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-800">
          <Navbar />
          <Routes>
            {/* 2. USE THE REAL COMPONENTS HERE */}
            <Route path="/" element={<BrowsePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
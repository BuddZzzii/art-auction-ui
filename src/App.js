import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Using the lowercase "pages" folder
import BrowsePage from './pages/BrowsePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Added the Register import
import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<BrowsePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> {/* Added the Register route */}

            {/* PROTECTED ROUTES */}
            <Route 
              path="/artwork/:id" 
              element={
                <ProtectedRoute>
                  <ArtworkDetailsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* 404 WILDCARD */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
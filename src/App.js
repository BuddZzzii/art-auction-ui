import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Using the Fixed Uppercase "Pages" folder
import BrowsePage from './Pages/BrowsePage'; 
import LoginPage from './Pages/LoginPage';
import ArtworkDetailsPage from './Pages/ArtworkDetailsPage';
import ProfilePage from './Pages/ProfilePage';
import NotFoundPage from './Pages/NotFoundPage';

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
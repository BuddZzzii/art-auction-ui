import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import BrowsePage from './Pages/BrowsePage'; 
import LoginPage from './Pages/LoginPage';
import ArtworkDetailsPage from './Pages/ArtworkDetailsPage';
import ProfilePage from './Pages/ProfilePage';
import NotFoundPage from './Pages/NotFoundPage'; // The new 404 room!

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Main Layout Container */}
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          
          <Routes>
            {/* PUBLIC ROUTES: Anyone can visit these */}
            <Route path="/" element={<BrowsePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* PROTECTED ROUTES: The Bouncer (ProtectedRoute) checks for ID cards */}
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

            {/* 🚩 THE 404 WILDCARD: This catches any URL that isn't listed above.
                It MUST stay at the very bottom of the list! */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
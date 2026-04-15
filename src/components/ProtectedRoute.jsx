import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Add useLocation
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation(); // This remembers where the user was trying to go

  if (!user) {
    // We pass a 'state' object containing our message
    return <Navigate 
      to="/login" 
      replace 
      state={{ 
        message: "You need to be logged in to view artwork details and place bids! ",
        from: location 
      }} 
    />;
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // ⚠️ FAKE AUTHENTICATION TOGGLE
  // Change this to 'true' to pretend you are logged in.
  // Change this to 'false' to test the Bouncer kicking you out.
  const isLoggedIn = true; 

  if (!isLoggedIn) {
    // The user has no key. Instantly teleport them to the Login screen.
    // 'replace' means they can't even use the browser's Back button to sneak back in.
    return <Navigate to="/login" replace />;
  }

  // The user has the key! Render whatever page they were trying to access.
  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !token) {
    // Redirect unauthenticated user to home page, preserving attempt location
    return <Navigate to="/" state={{ from: location, message: 'Please log in to access the order page.' }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { customer, isAuthenticated, token } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && !token) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Admin access required. Please log in with the administrator account (qwerty@gmail.com).',
        }}
        replace
      />
    );
  }

  const isAdmin = customer?.role === 'admin' || customer?.email === 'qwerty@gmail.com';

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        state={{
          message: 'Access Denied: You do not have administrator privileges. Please log in as Admin (qwerty@gmail.com).',
        }}
        replace
      />
    );
  }

  return children;
};

export default AdminProtectedRoute;

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('quickbite_customer');
    try {
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('quickbite_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = (customerData, authToken) => {
    setCustomer(customerData);
    setToken(authToken);
    localStorage.setItem('quickbite_customer', JSON.stringify(customerData));
    localStorage.setItem('quickbite_token', authToken);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('quickbite_customer');
    localStorage.removeItem('quickbite_token');
  };

  const value = {
    customer,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

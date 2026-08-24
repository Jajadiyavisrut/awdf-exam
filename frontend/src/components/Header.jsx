import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { customer, isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-group">
          <div className="brand-logo-icon">🍔</div>
          <div>
            <h1 className="brand-title">
              Quick<span>Bite</span>
            </h1>
            <p className="brand-tagline">Fast • Fresh • Delivered Hot</p>
          </div>
        </Link>

        <div className="header-user-status">
          {isAuthenticated && customer ? (
            <>
              <span className="user-badge">Customer</span>
              <span>
                Hello, <strong>{customer.name || customer.email}</strong>
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--text-subtle)' }}>Guest Mode</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• Log in to place orders</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

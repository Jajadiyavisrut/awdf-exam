import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = customer?.role === 'admin' || customer?.email === 'qwerty@gmail.com';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="site-navbar">
      <div className="navbar-inner">
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>🏠</span> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/restaurants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>🍽️</span> Restaurants
            </NavLink>
          </li>
          <li>
            <NavLink to="/order" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>🛒</span> Place Order
            </NavLink>
          </li>
          {/* Admin Panel is ONLY visible to the Admin user (qwerty@gmail.com) */}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span>⚙️</span> Admin Panel
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-auth-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <span>👤</span>
                <strong>{customer?.name?.split(' ')[0] || customer?.email}</strong>
                {isAdmin && (
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary" title="Sign out">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

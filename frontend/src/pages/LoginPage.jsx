import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname;
  const notice = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({ email: email.trim(), password });
      if (res.success && res.token) {
        login(res.customer, res.token);

        // Redirect Admin directly to /admin, Customer to intended route or /restaurants
        if (res.customer.role === 'admin' || res.customer.email === 'qwerty@gmail.com') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from || '/restaurants', { replace: true });
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Sign In to QuickBite</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your credentials to access your account
          </p>
        </div>

        {notice && (
          <div
            className="error-container"
            style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}
          >
            <div>{notice}</div>
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. visrut@example.com or qwerty@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account yet? </span>
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign Up here
          </Link>
        </div>

        {/* Viva / Demo Quick Credential Fillers */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px dashed var(--border)',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ <strong>1-Click Viva Demo Accounts:</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillCredentials('visrut@example.com', 'Visrut@12345')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
              title="Customer role"
            >
              👤 Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('qwerty@gmail.com', 'qwertyuiop@12345')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem', borderColor: 'var(--primary)' }}
              title="Admin role"
            >
              ⚙️ Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

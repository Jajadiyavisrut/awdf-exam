import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';

// Regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=-])[A-Za-z\d@$!%*?&#^()_+=-]{8,}$/;

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+=-]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  const isMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password does not meet the security criteria: must have 8+ characters, uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match! Please check the repeat password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      });

      if (res.success && res.token) {
        login(res.customer, res.token);
        navigate('/restaurants', { replace: true });
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign up to order food from top restaurants
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Visrut Jajadiya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. visrut@example.com"
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
                placeholder="Create a strong password"
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
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>

            {/* Live Password Strength Requirements Indicator */}
            {password.length > 0 && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.6rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Password Requirements:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem' }}>
                  <span style={{ color: hasMinLength ? 'var(--accent)' : 'var(--danger)' }}>
                    {hasMinLength ? '✓' : '✗'} 8+ Characters
                  </span>
                  <span style={{ color: hasUpper ? 'var(--accent)' : 'var(--danger)' }}>
                    {hasUpper ? '✓' : '✗'} 1 Uppercase (A-Z)
                  </span>
                  <span style={{ color: hasLower ? 'var(--accent)' : 'var(--danger)' }}>
                    {hasLower ? '✓' : '✗'} 1 Lowercase (a-z)
                  </span>
                  <span style={{ color: hasNumber ? 'var(--accent)' : 'var(--danger)' }}>
                    {hasNumber ? '✓' : '✗'} 1 Number (0-9)
                  </span>
                  <span style={{ color: hasSpecial ? 'var(--accent)' : 'var(--danger)' }}>
                    {hasSpecial ? '✓' : '✗'} 1 Special (@$!%*?)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Repeat Password (Confirmation) *</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Re-enter your password to confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <span
                style={{
                  fontSize: '0.8rem',
                  marginTop: '0.25rem',
                  display: 'block',
                  color: isMatch ? 'var(--accent)' : 'var(--danger)',
                  fontWeight: 600,
                }}
              >
                {isMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Delivery Address</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="e.g. Room 304, Campus Towers, Tech City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up & Continue'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

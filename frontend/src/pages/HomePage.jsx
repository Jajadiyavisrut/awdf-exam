import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import Loading from '../components/Loading';

const HomePage = () => {
  const { customer, isAuthenticated, login } = useAuth();
  const location = useLocation();
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickLoginMsg, setQuickLoginMsg] = useState('');

  const redirectNotice = location.state?.message;

  useEffect(() => {
    const fetchTopRestaurants = async () => {
      try {
        const res = await api.getRestaurants();
        if (res.success && res.data) {
          // Take top 3 highest rated
          setFeaturedRestaurants(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRestaurants();
  }, []);

  const handleQuickVivaLogin = async () => {
    try {
      const res = await api.login({
        email: 'visrut@example.com',
        name: 'Visrut Jajadiya',
        phone: '+91 98765 43210',
        address: 'Room 304, Campus Towers, Tech City',
      });
      if (res.success) {
        login(res.customer, res.token);
        setQuickLoginMsg('Logged in as Visrut Jajadiya successfully!');
        setTimeout(() => setQuickLoginMsg(''), 4000);
      }
    } catch (err) {
      setQuickLoginMsg('Backend connection required for login.');
    }
  };

  return (
    <div>
      {redirectNotice && (
        <div className="error-container" style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}>
          <div>
            <strong>Access Notice:</strong> {redirectNotice}
          </div>
        </div>
      )}

      {quickLoginMsg && (
        <div className="error-container" style={{ background: '#d1fae5', borderColor: '#a7f3d0', color: '#065f46' }}>
          <div>
            <strong>Success:</strong> {quickLoginMsg}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Craving Delicious Food? <span>QuickBite</span> Has You Covered.
          </h1>
          <p className="hero-desc">
            Explore premier restaurants in your city, customize your orders in seconds, and track real-time delivery with our modern food ordering platform.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Explore Restaurants 🍕
            </Link>
            <Link to="/order" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Place Order 🛒
            </Link>
            {!isAuthenticated && (
              <button
                onClick={handleQuickVivaLogin}
                className="btn btn-lg"
                style={{ background: '#10b981', color: 'white' }}
                title="Instant 1-click test login for Viva/Demo"
              >
                ⚡ 1-Click Demo Login
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Highlights / Features */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Why Choose QuickBite?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lightning Fast Delivery</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Fresh, piping-hot meals delivered straight to your door in 30 minutes or less.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⭐</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Top-Rated Kitchens</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Curated dining spots with authentic cuisines, strictly maintained quality, and hygiene ratings.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Authentication</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              JWT Bearer token security, protected order routing, and populated Mongoose models.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Preview */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Featured Restaurants</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Customer favorites with top ratings and open kitchens
            </p>
          </div>
          <Link to="/restaurants" className="btn btn-sm btn-secondary">
            View All ({featuredRestaurants.length > 0 ? `${featuredRestaurants.length}+` : '...'}) →
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading featured restaurants..." />
        ) : featuredRestaurants.length > 0 ? (
          <div className="restaurant-grid">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                _id={restaurant._id}
                name={restaurant.name}
                cuisine={restaurant.cuisine}
                rating={restaurant.rating}
                isOpen={restaurant.isOpen}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No restaurants currently listed. Start backend server to auto-seed initial restaurants.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

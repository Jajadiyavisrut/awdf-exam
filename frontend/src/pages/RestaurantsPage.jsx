import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [openOnlyFilter, setOpenOnlyFilter] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getRestaurants();
      if (res.success && Array.isArray(res.data)) {
        setRestaurants(res.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurant listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Extract unique cuisines for quick filter tabs
  const availableCuisines = useMemo(() => {
    const set = new Set();
    restaurants.forEach((r) => {
      if (r.cuisine) set.add(r.cuisine);
    });
    return ['All', ...Array.from(set)];
  }, [restaurants]);

  // Client-side search and filtering by restaurant name, cuisine, and isOpen
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine =
        selectedCuisine === 'All' || r.cuisine.toLowerCase() === selectedCuisine.toLowerCase();

      const matchesOpenOnly = !openOnlyFilter || r.isOpen === true;

      return matchesSearch && matchesCuisine && matchesOpenOnly;
    });
  }, [restaurants, searchTerm, selectedCuisine, openOnlyFilter]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Explore Restaurants</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse top dining spots, search by your favorite cuisine, and discover open kitchens.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div className="search-container" style={{ marginBottom: '1rem' }}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by restaurant name or cuisine (e.g. Italian, Biryani, Bistro)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setOpenOnlyFilter(!openOnlyFilter)}
            className={`btn ${openOnlyFilter ? 'btn-primary' : 'btn-secondary'}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {openOnlyFilter ? '✓ Showing Open Now Only' : 'Show Open Now Only'}
          </button>
        </div>

        {/* Cuisine Filter Tags */}
        {availableCuisines.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Cuisines:
            </span>
            {availableCuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.825rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  backgroundColor: selectedCuisine === cuisine ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: selectedCuisine === cuisine ? 'white' : 'var(--text-main)',
                  fontWeight: selectedCuisine === cuisine ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {cuisine}
              </button>
            ))}
            {(searchTerm || selectedCuisine !== 'All' || openOnlyFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('All');
                  setOpenOnlyFilter(false);
                }}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem', marginLeft: 'auto' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={fetchRestaurants} />}

      {/* Loading state */}
      {loading && <Loading message="Fetching live restaurant directory..." />}

      {/* Restaurant Cards Grid */}
      {!loading && !error && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredRestaurants.length}</strong> of <strong>{restaurants.length}</strong> restaurants
            </p>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => (
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
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍽️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No restaurants found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                We couldn't find any restaurants matching your search for "{searchTerm}". Try clearing your filters or search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('All');
                  setOpenOnlyFilter(false);
                }}
                className="btn btn-primary btn-sm"
              >
                Clear Search Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;

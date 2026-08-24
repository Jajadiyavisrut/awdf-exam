import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ _id, name, cuisine, rating = 4.0, isOpen = true }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-card-header">
        <div>
          <h3 className="restaurant-name">{name}</h3>
          <p className="restaurant-cuisine">{cuisine}</p>
        </div>
        <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
          <span style={{ fontSize: '0.6rem' }}>●</span>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-meta-row">
          <div className="rating-badge">
            <span>★</span>
            <span>{Number(rating).toFixed(1)}</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isOpen ? '⚡ Quick 30 min delivery' : 'Opens tomorrow at 10 AM'}
          </span>
        </div>
      </div>

      <div className="restaurant-card-footer">
        {isOpen ? (
          <Link
            to={_id ? `/order?restaurantId=${_id}&restaurantName=${encodeURIComponent(name)}` : '/order'}
            className="btn btn-primary btn-block btn-sm"
          >
            Order Now →
          </Link>
        ) : (
          <button className="btn btn-secondary btn-block btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
            Currently Closed
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;

import React from 'react';

const Loading = ({ message = 'Loading delicious options...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" role="status" aria-label="loading"></div>
      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};

export default Loading;

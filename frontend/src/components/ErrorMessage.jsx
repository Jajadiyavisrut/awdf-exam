import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span style={{ fontWeight: 500 }}>{message}</span>
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-secondary" onClick={onRetry} style={{ background: 'white' }}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

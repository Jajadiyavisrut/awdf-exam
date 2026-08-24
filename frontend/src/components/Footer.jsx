import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>QuickBite Food Ordering System</h3>
          <p>Full-Stack MERN Architecture • React, Express, Node.js & MongoDB</p>
        </div>

        <div className="footer-meta">
          <p>
            <strong>ITUE301 Set A Practical Exam</strong>
          </p>
          <p style={{ marginTop: '0.25rem' }}>
            Built with React Router, Context API, Mongoose & JWT Authentication
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

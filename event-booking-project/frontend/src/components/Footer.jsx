// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🎭</span>
              EventHub
            </div>
            <p className="footer-description">
              Your premier destination for discovering and booking amazing events. 
              Connect with communities and create unforgettable memories.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Discover</h4>
            <ul className="footer-links">
              <li><Link to="/events">All Events</Link></li>
              <li><Link to="/events?category=music">Music Events</Link></li>
              <li><Link to="/events?category=conference">Conferences</Link></li>
              <li><Link to="/events?category=food">Food & Drink</Link></li>
              <li><Link to="/events?category=arts">Arts & Theater</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/refunds">Refunds</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 EventHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/sitemap">Sitemap</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
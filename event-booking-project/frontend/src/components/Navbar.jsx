// components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartIcon from './CartIcon';
import './style/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Left: Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🎭</span>
            EventHub
          </Link>

          {/* Center: Links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>
              Events
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
            <CartIcon count={getCartItemsCount()} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

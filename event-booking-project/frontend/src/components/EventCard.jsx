// components/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import WishlistButton from './WishlistButton';
import './style/EventCard.css';  // ✅ make sure path is correct

const EventCard = ({ event }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <div className="event-overlay">
          {isAuthenticated && (
            <WishlistButton 
              event={event} 
              isWishlisted={isInWishlist(event.id)}
            />
          )}
          <span className="event-category">{event.category}</span>
        </div>
      </div>
      
      <div className="event-content">
        <div className="event-date">
          <span className="date-day">{new Date(event.date).getDate()}</span>
          <span className="date-month">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
        </div>
        
        <div className="event-info">
          <h3 className="event-title">
            <Link to={`/event/${event.id}`}>{event.title}</Link>
          </h3>
          <p className="event-location">📍 {event.location}</p>
          <p className="event-time">🕒 {formatDate(event.date)} at {formatTime(event.date)}</p>
          
          <div className="event-footer">
            <span className="event-price">${event.price}</span>
            <button 
              onClick={() => addToCart(event)}
              className="btn btn-primary btn-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EventCard);
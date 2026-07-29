// components/pages/EventDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import WishlistButton from '../WishlistButton';
import './style/EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      // Mock data - replace with API call
      const mockEvent = {
        id: parseInt(id),
        title: "Summer Music Festival 2024",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
        date: "2024-06-15T18:00:00",
        location: "Central Park, New York",
        venue: "Main Stage, Central Park",
        price: 75,
        category: "Music",
        description: "Join us for the most anticipated music festival of the year! Featuring top artists across multiple genres, food trucks, and amazing atmosphere.",
        longDescription: `The Summer Music Festival 2024 promises to be an unforgettable experience with three stages featuring different music genres. From rock and pop to electronic and indie, there's something for every music lover.

Main Stage Highlights:
- Taylor Swift (Headliner)
- The Weeknd
- Coldplay
- Billie Eilish

What to expect:
- Multiple food and beverage stations
- Art installations and photo booths
- VIP lounges with premium amenities
- Merchandise shops

Gates open at 4:00 PM. Show starts at 6:00 PM.`,
        availableTickets: 150,
        totalTickets: 500,
        organizer: "Music Events Inc.",
        tags: ["Music", "Festival", "Outdoor", "Summer"],
        includes: ["Live Performances", "Food & Drinks", "Merchandise Stand", "Photo Opportunities"]
      };
      setEvent(mockEvent);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    for (let i = 0; i < ticketCount; i++) {
      addToCart(event);
    }
    
    // Show success message or redirect to cart
    alert(`${ticketCount} ticket(s) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error-page">
        <h2>Event not found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/events')} className="btn btn-primary">
          Browse Events
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(event.id);

  return (
    <div className="event-details-page">
      <div className="container">
        <div className="event-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back to Events
          </button>
          
          {isAuthenticated && (
            <WishlistButton 
              event={event}
              isWishlisted={isWishlisted}
              size="large"
            />
          )}
        </div>

        <div className="event-details-grid">
          <div className="event-image-section">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
              <div className="event-badge">{event.category}</div>
            </div>
            
            <div className="event-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">📅</span>
                <div>
                  <strong>Date & Time</strong>
                  <p>{formatDate(event.date)} at {formatTime(event.date)}</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <span className="highlight-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{event.location}</p>
                  <small>{event.venue}</small>
                </div>
              </div>
              
              <div className="highlight-item">
                <span className="highlight-icon">🎫</span>
                <div>
                  <strong>Tickets Available</strong>
                  <p>{event.availableTickets} of {event.totalTickets} remaining</p>
                </div>
              </div>
            </div>
          </div>

          <div className="event-info-section">
            <div className="event-main-info">
              <h1>{event.title}</h1>
              <p className="event-organizer">By {event.organizer}</p>
              <p className="event-description">{event.description}</p>
              
              <div className="event-tags">
                {event.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="event-tabs">
              <div className="tab-headers">
                <button 
                  className={`tab-header ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`tab-header ${activeTab === 'includes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('includes')}
                >
                  What's Included
                </button>
                <button 
                  className={`tab-header ${activeTab === 'location' ? 'active' : ''}`}
                  onClick={() => setActiveTab('location')}
                >
                  Location
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'details' && (
                  <div className="tab-panel">
                    <p>{event.longDescription}</p>
                  </div>
                )}
                
                {activeTab === 'includes' && (
                  <div className="tab-panel">
                    <ul className="includes-list">
                      {event.includes.map((item, index) => (
                        <li key={index}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'location' && (
                  <div className="tab-panel">
                    <div className="location-map">
                      <div className="map-placeholder">
                        🗺️ Map of {event.location}
                      </div>
                      <p><strong>Address:</strong> {event.venue}, {event.location}</p>
                      <p><strong>Parking:</strong> Available onsite and nearby lots</p>
                      <p><strong>Public Transport:</strong> Subway lines A, B, C within walking distance</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="event-booking-section">
            <div className="booking-card">
              <div className="price-section">
                <span className="price">${event.price}</span>
                <span className="price-label">per ticket</span>
              </div>
              
              <div className="ticket-selector">
                <label>Number of Tickets:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </button>
                  <span>{ticketCount}</span>
                  <button 
                    onClick={() => setTicketCount(ticketCount + 1)}
                    disabled={ticketCount >= event.availableTickets}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="booking-summary">
                <div className="summary-row">
                  <span>{ticketCount} x ${event.price}</span>
                  <span>${(ticketCount * event.price).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>${(ticketCount * 2.5).toFixed(2)}</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(ticketCount * (event.price + 2.5)).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="booking-actions">
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-outline"
                  disabled={event.availableTickets === 0}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="btn btn-primary"
                  disabled={event.availableTickets === 0}
                >
                  Buy Now
                </button>
              </div>
              
              {event.availableTickets === 0 ? (
                <div className="sold-out-banner">
                  Sold Out
                </div>
              ) : event.availableTickets < 10 ? (
                <div className="low-tickets-warning">
                  Only {event.availableTickets} tickets left!
                </div>
              ) : null}
              
              <div className="security-badges">
                <div className="security-item">🔒 Secure Checkout</div>
                <div className="security-item">🔄 Easy Refunds</div>
                <div className="security-item">📱 Mobile Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
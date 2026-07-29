// components/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../EventCard';
import './style/HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFeaturedEvents = async () => {
      try {
        // Mock data - replace with actual API call
        const mockEvents = [
          {
            id: 1,
            title: "Summer Music Festival 2024",
            image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
            date: "2024-06-15T18:00:00",
            location: "Central Park, New York",
            price: 75,
            category: "Music"
          },
          {
            id: 2,
            title: "Tech Conference 2024",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
            date: "2024-07-20T09:00:00",
            location: "Convention Center, San Francisco",
            price: 299,
            category: "Conference"
          },
          {
            id: 3,
            title: "Food & Wine Expo",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
            date: "2024-05-10T11:00:00",
            location: "Metro Hall, Chicago",
            price: 45,
            category: "Food"
          }
        ];
        setFeaturedEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading featured events...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing
              <span className="highlight"> Events</span>
              Near You
            </h1>
            <p className="hero-subtitle">
              From concerts and conferences to workshops and exhibitions - 
              find your next unforgettable experience.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary btn-large">
                Explore Events
              </Link>
              <Link to="/register" className="btn btn-outline btn-large">
                Become an Organizer
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <span>🎵</span>
              <p>Music Events</p>
            </div>
            <div className="floating-card card-2">
              <span>🎭</span>
              <p>Theater Shows</p>
            </div>
            <div className="floating-card card-3">
              <span>💼</span>
              <p>Conferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-events">
        <div className="container">
          <div className="section-header">
            <h2>Featured Events</h2>
            <p>Handpicked experiences you don't want to miss</p>
          </div>
          <div className="events-grid">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/events" className="btn btn-primary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Easy Booking</h3>
              <p>Simple and secure ticket purchasing process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your tickets anytime, anywhere</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Curated Events</h3>
              <p>Only the best events from trusted organizers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
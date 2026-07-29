// components/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import EventCard from '../EventCard';
import SearchFilter from '../SearchFilter';
import './style/EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: [0, 500],
    date: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filters, events]);

  const fetchEvents = async () => {
    try {
      // Mock data - replace with API call
      const mockEvents = [
        {
          id: 1,
          title: "Summer Music Festival 2024",
          image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
          date: "2024-06-15T18:00:00",
          location: "Central Park, New York",
          price: 75,
          category: "Music",
          description: "Annual summer music festival featuring top artists",
          availableTickets: 150
        },
        {
          id: 2,
          title: "Tech Conference 2024",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
          date: "2024-07-20T09:00:00",
          location: "Convention Center, San Francisco",
          price: 299,
          category: "Conference",
          description: "Leading technology conference with industry experts",
          availableTickets: 300
        },
        {
          id: 3,
          title: "Food & Wine Expo",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
          date: "2024-05-10T11:00:00",
          location: "Metro Hall, Chicago",
          price: 45,
          category: "Food",
          description: "Gourmet food and wine tasting experience",
          availableTickets: 200
        },
        {
          id: 4,
          title: "Comedy Night Live",
          image: "https://images.unsplash.com/photo-1543584756-8f40a802e14d?w=400",
          date: "2024-04-25T20:00:00",
          location: "Comedy Club, Los Angeles",
          price: 35,
          category: "Comedy",
          description: "Stand-up comedy with famous comedians",
          availableTickets: 100
        },
        {
          id: 5,
          title: "Art Exhibition Opening",
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
          date: "2024-05-05T18:00:00",
          location: "Modern Art Museum, Miami",
          price: 25,
          category: "Art",
          description: "Contemporary art exhibition opening night",
          availableTickets: 80
        },
        {
          id: 6,
          title: "Marathon 2024",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          date: "2024-09-10T06:00:00",
          location: "Downtown, Boston",
          price: 60,
          category: "Sports",
          description: "Annual city marathon event",
          availableTickets: 1000
        }
      ];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.date) {
      filtered = filtered.filter(event => event.date.startsWith(filters.date));
    }

    filtered = filtered.filter(event =>
      event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1]
    );

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container">
        <div className="page-header">
          <h1>Discover Events</h1>
          <p>Find your next unforgettable experience</p>
        </div>

        <SearchFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          eventsCount={filteredEvents.length}
        />

        <div className="events-results">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">🔍</div>
              <h3>No events found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              <div className="load-more">
                <button className="btn btn-outline">
                  Load More Events
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
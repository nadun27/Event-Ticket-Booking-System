import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './style/AdminEvents.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(Array.isArray(data) ? data : (data?.events ?? []));
    } catch (e) {
      console.error('Error fetching events:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading events...</div>;

  return (
    <div className="admin-events container">
      <div className="admin-header">
        <h1>Manage Events</h1>
        <button
          onClick={() => navigate('/admin/events/new')}
          className="btn btn-primary"
        >
          + Add New Event
        </button>
      </div>

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Price</th>
              <th>Tickets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(evt => (
              <tr key={evt.id || evt._id}>
                <td>
                  <div className="event-info">
                    <img src={evt.image} alt={evt.title} />
                    <span>{evt.title}</span>
                  </div>
                </td>
                <td>{evt.date ? new Date(evt.date).toLocaleDateString() : '-'}</td>
                <td>{evt.venue || evt.location || '-'}</td>
                <td>${evt.ticketPrice ?? evt.price ?? 0}</td>
                <td>{evt.availableTickets ?? evt.ticketsAvailable ?? '-'}</td>
                <td>
                  <Link className="btn btn-outline btn-sm" to={`/admin/events/${evt.id || evt._id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;

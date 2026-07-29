// src/components/pages/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // ✅ use the default ApiService instance
import './style/AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Backend route: GET /api/bookings
      const data = await api.request('/bookings');
      setBookings(Array.isArray(data) ? data : (data?.bookings ?? []));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const id = bookingId?._id || bookingId?.id || bookingId;
      // Backend route: PUT /api/bookings/:id/status  { status }
      await api.request(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (loading) return <div className="container">Loading bookings...</div>;

  return (
    <div className="admin-bookings container">
      <h1>Manage Bookings</h1>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Event</th>
              <th>User</th>
              <th>Date</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const id = b.id || b._id;
              return (
                <tr key={id}>
                  <td>{b.bookingReference || id}</td>
                  <td>{b.eventTitle || b.event?.title || '-'}</td>
                  <td>{b.userEmail || `User ${b.userId ?? '-'}`}</td>
                  <td>
                    {b.bookingDate
                      ? new Date(b.bookingDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {b.quantity} {b.ticketType}
                  </td>
                  <td>${(b.totalAmount ?? 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => updateBookingStatus(id, e.target.value)}
                      className="status-select"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;

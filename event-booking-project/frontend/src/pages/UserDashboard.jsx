import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { bookingsAPI } from '../services/api';
import QRCodeGenerator from '../components/QRCodeGenerator';
import CancellationModal from '../components/CancellationModal';
import './style/UserDashboard.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellationModal, setCancellationModal] = useState({ isOpen: false, booking: null });

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings(user.id);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      await bookingsAPI.updateStatus(bookingId, 'cancelled');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const openCancellationModal = (booking) => {
    setCancellationModal({ isOpen: true, booking });
  };

  const closeCancellationModal = () => {
    setCancellationModal({ isOpen: false, booking: null });
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here are your upcoming events and bookings</p>
        </div>

        <div className="bookings-section">
          <h2>Your Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You haven't made any bookings yet.</p>
              <a href="/events" className="btn-primary">Browse Events</a>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h3>{booking.eventTitle}</h3>
                    <p className="booking-date">{new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}</p>
                    <p className="booking-venue">{booking.eventVenue}</p>
                    <div className="booking-details">
                      <span>Type: {booking.ticketType.toUpperCase()}</span>
                      <span>Quantity: {booking.quantity}</span>
                      <span>Total: ${booking.totalAmount}</span>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'confirmed' && (
                      <>
                        <QRCodeGenerator 
                          bookingId={booking.bookingReference} 
                          eventName={booking.eventTitle} 
                        />
                        <button 
                          onClick={() => openCancellationModal(booking)}
                          className="btn-cancel"
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={closeCancellationModal}
        onConfirm={handleCancelBooking}
        booking={cancellationModal.booking}
      />
    </div>
  );
};

export default UserDashboard;
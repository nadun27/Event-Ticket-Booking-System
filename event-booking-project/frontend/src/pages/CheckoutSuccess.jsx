import React from 'react';
import { Link } from 'react-router-dom';
import './style/CheckoutSuccess.css';

const CheckoutSuccess = () => {
  return (
    <div className="checkout-success">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase. Your tickets have been booked successfully.</p>
          <p>You will receive a confirmation email shortly with your ticket details.</p>
          
          <div className="success-actions">
            <Link to="/dashboard" className="btn-primary">View My Bookings</Link>
            <Link to="/events" className="btn-secondary">Browse More Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
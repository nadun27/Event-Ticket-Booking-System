// components/pages/CheckoutSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QRCodeGenerator from '../QRCodeGenerator';
import './style/CheckoutSuccess.css';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { orderNumber, total, items } = location.state || {
    orderNumber: 'ORD-000000',
    total: 0,
    items: []
  };

  const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-success">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">🎉</div>
          
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            Thank you for your purchase, {user?.firstName || 'Customer'}! Your tickets are confirmed.
          </p>
          
          <div className="order-details">
            <div className="detail-card">
              <h3>Order Summary</h3>
              <div className="detail-row">
                <span>Order Number:</span>
                <strong>{orderNumber}</strong>
              </div>
              <div className="detail-row">
                <span>Total Amount:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="detail-row">
                <span>Total Tickets:</span>
                <strong>{totalTickets}</strong>
              </div>
              <div className="detail-row">
                <span>Order Date:</span>
                <strong>{new Date().toLocaleDateString()}</strong>
              </div>
            </div>
            
            <div className="tickets-section">
              <h3>Your Tickets</h3>
              <div className="tickets-list">
                {items.map((item, index) => (
                  <div key={item.id} className="ticket-card">
                    <div className="ticket-header">
                      <h4>{item.title}</h4>
                      <span className="ticket-count">{item.quantity} ticket(s)</span>
                    </div>
                    
                    <div className="ticket-details">
                      <div className="ticket-info">
                        <span className="label">Date & Time:</span>
                        <span>{new Date(item.date).toLocaleString()}</span>
                      </div>
                      <div className="ticket-info">
                        <span className="label">Location:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="ticket-info">
                        <span className="label">Ticket Type:</span>
                        <span>General Admission</span>
                      </div>
                    </div>
                    
                    <div className="ticket-qr">
                      <QRCodeGenerator 
                        value={`${orderNumber}-${index + 1}`}
                        size={80}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="success-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              View in Dashboard
            </button>
            <button onClick={() => window.print()} className="btn btn-outline">
              Print Tickets
            </button>
            <button onClick={() => navigate('/events')} className="btn btn-outline">
              Browse More Events
            </button>
          </div>
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-icon">📧</div>
                <h4>Email Confirmation</h4>
                <p>You'll receive an email with your tickets within 5 minutes.</p>
              </div>
              <div className="step-item">
                <div className="step-icon">📱</div>
                <h4>Mobile Tickets</h4>
                <p>Show your QR code at the event entrance for scanning.</p>
              </div>
              <div className="step-item">
                <div className="step-icon">🔄</div>
                <h4>Need Help?</h4>
                <p>Contact support if you have any questions about your order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
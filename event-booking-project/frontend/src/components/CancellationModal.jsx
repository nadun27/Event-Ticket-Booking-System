import React, { useState } from 'react';
import './style/CancellationModal.css';

const CancellationModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(booking.id, reason);
    setReason('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cancel Booking</h3>
        <p>Are you sure you want to cancel your booking for <strong>{booking?.eventTitle}</strong>?</p>
        
        <div className="form-group">
          <label>Reason for cancellation (optional):</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            rows="3"
            className="reason-input"
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Keep Booking</button>
          <button onClick={handleConfirm} className="btn-confirm">Cancel Booking</button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
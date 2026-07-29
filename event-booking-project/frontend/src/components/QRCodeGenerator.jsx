// components/QRCodeGenerator.jsx
import React from 'react';
import './style/QRCodeGenerator.css';

const QRCodeGenerator = ({ value, size = 120 }) => {
  // In a real app, you would use a QR code library like qrcode.react
  // This is a simple placeholder implementation
  const generateQRPlaceholder = () => {
    return (
      <div className="qr-placeholder" style={{ width: size, height: size }}>
        <div className="qr-grid">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`qr-cell ${i % 2 === 0 ? 'filled' : ''}`}></div>
          ))}
        </div>
        <div className="qr-text">QR Code</div>
      </div>
    );
  };

  return (
    <div className="qrcode-generator">
      {generateQRPlaceholder()}
      <div className="qr-value">{value}</div>
    </div>
  );
};

export default QRCodeGenerator;
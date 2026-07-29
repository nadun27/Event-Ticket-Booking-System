// components/WishlistButton.jsx
import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import './style/WishlistButton.css';

const WishlistButton = ({ event, isWishlisted, size = 'medium' }) => {
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleClick = () => {
    if (isWishlisted) {
      removeFromWishlist(event.id);
    } else {
      addToWishlist(event);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-btn ${size} ${isWishlisted ? 'wishlisted' : ''}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="heart-icon">{isWishlisted ? '❤️' : '🤍'}</span>
    </button>
  );
};

export default WishlistButton;
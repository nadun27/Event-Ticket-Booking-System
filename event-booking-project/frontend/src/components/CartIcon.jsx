// components/CartIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CartIcon = ({ count }) => {
  return (
    <Link to="/cart" className="cart-icon">
      🛒
      {count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  );
};

export default CartIcon;

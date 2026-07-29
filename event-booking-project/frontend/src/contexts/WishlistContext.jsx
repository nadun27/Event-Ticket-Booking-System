// contexts/WishlistContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      // Check if event is already in wishlist
      if (state.items.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };

    case 'MOVE_TO_CART':
      const itemToMove = state.items.find(item => item.id === action.payload);
      if (!itemToMove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        movedItems: [...state.movedItems, itemToMove]
      };

    default:
      return state;
  }
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { 
    items: [], 
    movedItems: [] 
  });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (event) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: event });
    
    // Show notification
    showNotification(`"${event.title}" added to wishlist!`, 'success');
  };

  const removeFromWishlist = (eventId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: eventId });
    
    // Show notification
    const event = state.items.find(item => item.id === eventId);
    if (event) {
      showNotification(`"${event.title}" removed from wishlist`, 'info');
    }
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    showNotification('Wishlist cleared', 'info');
  };

  const moveToCart = (eventId) => {
    dispatch({ type: 'MOVE_TO_CART', payload: eventId });
    
    const event = state.items.find(item => item.id === eventId);
    if (event) {
      showNotification(`"${event.title}" moved to cart!`, 'success');
    }
  };

  const isInWishlist = (eventId) => {
    return state.items.some(item => item.id === eventId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `wishlist-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">×</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Add styles if not already added
    if (!document.querySelector('#wishlist-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'wishlist-notification-styles';
      styles.textContent = `
        .wishlist-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          transform: translateX(400px);
          opacity: 0;
          transition: all 0.3s ease;
          max-width: 400px;
          border-left: 4px solid #6366f1;
        }

        .wishlist-notification.success {
          border-left-color: #10b981;
        }

        .wishlist-notification.error {
          border-left-color: #ef4444;
        }

        .wishlist-notification.info {
          border-left-color: #3b82f6;
        }

        .wishlist-notification.show {
          transform: translateX(0);
          opacity: 1;
        }

        .notification-content {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          gap: 1rem;
        }

        .notification-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notification-message {
          flex: 1;
          font-weight: 500;
          color: #1f2937;
        }

        .notification-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .notification-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  };

  const value = {
    items: state.items,
    movedItems: state.movedItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isInWishlist,
    getWishlistCount,
    showNotification
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      
      {/* Wishlist Sidebar Component */}
      <WishlistSidebar 
        items={state.items}
        isInWishlist={isInWishlist}
        removeFromWishlist={removeFromWishlist}
        moveToCart={moveToCart}
      />
    </WishlistContext.Provider>
  );
};

// Wishlist Sidebar Component
const WishlistSidebar = ({ items, isInWishlist, removeFromWishlist, moveToCart }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleStorageChange = () => {
      // Trigger re-render when wishlist changes
      setIsOpen(prev => prev);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Wishlist Toggle Button */}
      <button 
        className="wishlist-sidebar-toggle"
        onClick={toggleSidebar}
        title={`Wishlist (${items.length})`}
      >
        <span className="wishlist-icon">❤️</span>
        {items.length > 0 && (
          <span className="wishlist-count">{items.length}</span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="wishlist-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`wishlist-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="wishlist-header">
          <h3>Your Wishlist</h3>
          <button 
            className="close-sidebar"
            onClick={toggleSidebar}
          >
            ×
          </button>
        </div>

        <div className="wishlist-content">
          {items.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-icon">🤍</div>
              <p>Your wishlist is empty</p>
              <small>Add events you're interested in!</small>
            </div>
          ) : (
            <div className="wishlist-items">
              {items.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p className="item-date">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className="item-price">${item.price}</p>
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => moveToCart(item.id)}
                      className="btn-move-cart"
                      title="Add to cart"
                    >
                      🛒
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="btn-remove"
                      title="Remove from wishlist"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="wishlist-footer">
            <button 
              className="btn btn-primary"
              onClick={() => {
                // Navigate to events page or show all wishlisted events
                window.location.href = '/events?wishlisted=true';
              }}
            >
              View All Wishlisted Events
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .wishlist-sidebar-toggle {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 8px 0 0 8px;
          padding: 1rem 0.5rem;
          cursor: pointer;
          z-index: 999;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .wishlist-sidebar-toggle:hover {
          padding-right: 1rem;
          transform: translateY(-50%) translateX(-5px);
        }

        .wishlist-icon {
          font-size: 1.5rem;
        }

        .wishlist-count {
          background: white;
          color: var(--primary);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .wishlist-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .wishlist-sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: white;
          box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .wishlist-sidebar.open {
          right: 0;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--gray-light);
          background: var(--light);
        }

        .wishlist-header h3 {
          margin: 0;
          color: var(--dark);
        }

        .close-sidebar {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--gray);
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-sidebar:hover {
          background: var(--gray-light);
          color: var(--dark);
        }

        .wishlist-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .empty-wishlist {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--gray);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .wishlist-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .wishlist-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--light);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .wishlist-item:hover {
          background: #f0f0f0;
        }

        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-details h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: var(--dark);
          line-height: 1.3;
        }

        .item-date {
          margin: 0 0 0.25rem 0;
          font-size: 0.8rem;
          color: var(--gray);
        }

        .item-price {
          margin: 0;
          font-weight: 600;
          color: var(--primary);
          font-size: 0.9rem;
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-move-cart,
        .btn-remove {
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .btn-move-cart:hover {
          background: var(--primary);
          color: white;
        }

        .btn-remove:hover {
          background: var(--danger);
          color: white;
        }

        .wishlist-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--gray-light);
        }

        @media (max-width: 768px) {
          .wishlist-sidebar {
            width: 100%;
            right: -100%;
          }

          .wishlist-sidebar-toggle {
            bottom: 20px;
            top: auto;
            right: 20px;
            transform: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
          }

          .wishlist-sidebar-toggle:hover {
            transform: scale(1.1);
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default WishlistProvider;
// components/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './style/UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Mock data - replace with API call
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2024-03-15',
          total: 150,
          status: 'confirmed',
          tickets: [
            {
              event: 'Summer Music Festival 2024',
              date: '2024-06-15T18:00:00',
              location: 'Central Park, New York',
              quantity: 2,
              price: 75
            }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-03-10',
          total: 45,
          status: 'completed',
          tickets: [
            {
              event: 'Food & Wine Expo',
              date: '2024-05-10T11:00:00',
              location: 'Metro Hall, Chicago',
              quantity: 1,
              price: 45
            }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = orders.filter(order => order.status === 'confirmed');
  const pastEvents = orders.filter(order => order.status === 'completed');

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}!
              <span className="welcome-emoji">👋</span>
            </h1>
            <p>Here's what's happening with your events</p>
          </div>
          
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-info">
                <span className="stat-number">{upcomingEvents.length}</span>
                <span className="stat-label">Upcoming Events</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{pastEvents.length}</span>
                <span className="stat-label">Past Events</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-number">${orders.reduce((sum, order) => sum + order.total, 0)}</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tabs-navigation">
            <button 
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </button>
            <button 
              className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </button>
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'upcoming' && (
              <div className="events-section">
                <h2>Your Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎭</div>
                    <h3>No upcoming events</h3>
                    <p>Explore events and book your next experience!</p>
                  </div>
                ) : (
                  <div className="events-grid">
                    {upcomingEvents.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">Order #{order.id}</span>
                          <span className={`order-status ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        {order.tickets.map((ticket, index) => (
                          <div key={index} className="ticket-item">
                            <div className="ticket-info">
                              <h4>{ticket.event}</h4>
                              <p className="ticket-date">
                                {new Date(ticket.date).toLocaleDateString()} • {ticket.location}
                              </p>
                              <p className="ticket-quantity">{ticket.quantity} ticket(s)</p>
                            </div>
                            <div className="ticket-actions">
                              <button className="btn btn-outline btn-sm">
                                View Tickets
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="order-footer">
                          <span className="order-total">Total: ${order.total}</span>
                          <button className="btn btn-primary btn-sm">
                            Manage Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="events-section">
                <h2>Past Events</h2>
                {pastEvents.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No past events yet</h3>
                    <p>Your attended events will appear here</p>
                  </div>
                ) : (
                  <div className="events-grid">
                    {pastEvents.map(order => (
                      <div key={order.id} className="order-card past">
                        <div className="order-header">
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-status completed">Completed</span>
                        </div>
                        
                        {order.tickets.map((ticket, index) => (
                          <div key={index} className="ticket-item">
                            <div className="ticket-info">
                              <h4>{ticket.event}</h4>
                              <p className="ticket-date">
                                Attended on {new Date(ticket.date).toLocaleDateString()}
                              </p>
                              <div className="rating-section">
                                <div className="stars">
                                  {'★'.repeat(5)}
                                </div>
                                <button className="rate-btn">Rate Event</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2>Profile Settings</h2>
                <div className="profile-card">
                  <div className="profile-header">
                    <div className="avatar">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="profile-info">
                      <h3>{user?.firstName} {user?.lastName}</h3>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  
                  <form className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" defaultValue={user?.firstName} />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" defaultValue={user?.lastName} />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" defaultValue={user?.email} />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
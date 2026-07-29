// components/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './style/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data
      const mockStats = {
        totalEvents: 24,
        totalUsers: 1567,
        totalRevenue: 45280,
        upcomingEvents: 8,
        ticketsSold: 3245,
        conversionRate: 12.5
      };

      const mockActivities = [
        { id: 1, type: 'booking', user: 'John Doe', event: 'Summer Festival', time: '2 hours ago' },
        { id: 2, type: 'registration', user: 'Sarah Wilson', event: 'New user', time: '4 hours ago' },
        { id: 3, type: 'event', user: 'Mike Johnson', event: 'Tech Conference created', time: '1 day ago' },
        { id: 4, type: 'payment', user: 'Emma Davis', event: 'Food Expo payment', time: '1 day ago' }
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.firstName}! Here's your overview.</p>
          </div>
          <div className="admin-actions">
            <Link to="/manage-events" className="btn btn-primary">
              + Create Event
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card large">
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-value">${stats.totalRevenue?.toLocaleString()}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
              <div className="stat-icon revenue">💰</div>
            </div>
            <div className="stat-trend positive">+12.5% from last month</div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-value">{stats.totalEvents}</span>
                <span className="stat-label">Total Events</span>
              </div>
              <div className="stat-icon events">🎭</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-icon users">👥</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-value">{stats.ticketsSold}</span>
                <span className="stat-label">Tickets Sold</span>
              </div>
              <div className="stat-icon tickets">🎫</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-grid">
            <div className="recent-activities">
              <h2>Recent Activities</h2>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'booking' && '🎫'}
                      {activity.type === 'registration' && '👤'}
                      {activity.type === 'event' && '🎭'}
                      {activity.type === 'payment' && '💳'}
                    </div>
                    <div className="activity-details">
                      <p>
                        <strong>{activity.user}</strong> {activity.type === 'registration' ? 'registered' : 
                         activity.type === 'event' ? 'created' : activity.type} {activity.event}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <Link to="/admin/events" className="action-card">
                  <div className="action-icon">🎭</div>
                  <span>Manage Events</span>
                </Link>
                <Link to="/admin/users" className="action-card">
                  <div className="action-icon">👥</div>
                  <span>User Management</span>
                </Link>
                <Link to="/admin/bookings" className="action-card">
                  <div className="action-icon">📊</div>
                  <span>View Bookings</span>
                </Link>
                <Link to="/admin/analytics" className="action-card">
                  <div className="action-icon">📈</div>
                  <span>Analytics</span>
                </Link>
              </div>
            </div>

            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-info">
                    <h4>Summer Music Festival</h4>
                    <p>June 15, 2024 • 500 attendees</p>
                  </div>
                  <div className="event-stats">
                    <span className="sold">450/500 sold</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '90%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-info">
                    <h4>Tech Conference</h4>
                    <p>July 20, 2024 • 300 attendees</p>
                  </div>
                  <div className="event-stats">
                    <span className="sold">150/300 sold</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '50%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
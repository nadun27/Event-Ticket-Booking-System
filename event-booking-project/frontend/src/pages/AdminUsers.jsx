import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import './style/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Since we don't have a dedicated users endpoint, we'll simulate this
      // In a real app, you would have an API endpoint to get all users
      const response = await fetch('/api/auth/users'); // This is just for demonstration
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data for demonstration
      setUsers([
        { id: 'U001', username: 'john_doe', email: 'john@example.com', name: 'John Doe', role: 'user' },
        { id: 'U002', username: 'jane_smith', email: 'jane@example.com', name: 'Jane Smith', role: 'user' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // These endpoints would need to be implemented in your backend
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get(ENDPOINTS.EVENTS.LIST),
        api.get(ENDPOINTS.BOOKINGS.LIST)
      ]);

      const events = eventsRes.data;
      const bookings = bookingsRes.data;

      const pending = bookings.filter(b => b.status === 'pending').length;
      const revenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      setStats({
        totalEvents: events.length,
        totalBookings: bookings.length,
        pendingBookings: pending,
        revenue: revenue
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.pendingBookings}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>${stats.revenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button 
          mode="contained" 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Events')}
        >
          Manage Events
        </Button>
        <Button 
          mode="contained" 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Bookings')}
        >
          Manage Bookings
        </Button>
      </View>

      <Card style={styles.recentCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Recent Bookings</Text>
          {recentBookings.map(booking => (
            <View key={booking.id} style={styles.bookingItem}>
              <Text style={styles.bookingEvent}>{booking.eventName}</Text>
              <Text style={styles.bookingDetails}>
                {booking.quantity} tickets • ${booking.totalAmount}
              </Text>
              <Text style={[
                styles.bookingStatus,
                booking.status === 'confirmed' ? styles.confirmed : 
                booking.status === 'pending' ? styles.pending : styles.cancelled
              ]}>
                {booking.status}
              </Text>
            </View>
          ))}
          {recentBookings.length === 0 && (
            <Text style={styles.noData}>No recent bookings</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  statLabel: {
    textAlign: 'center',
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  recentCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bookingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  bookingEvent: {
    fontWeight: '600',
    marginBottom: 5,
  },
  bookingDetails: {
    color: '#666',
    marginBottom: 5,
  },
  bookingStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  confirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  cancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default AdminDashboard;
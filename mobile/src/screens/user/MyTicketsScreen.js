import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import TicketCard from '../../components/TicketCard';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const MyTicketsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchBookings = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(ENDPOINTS.BOOKINGS.USER_BOOKINGS);
      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load your tickets. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authText}>Please login to view your tickets</Text>
        <CustomButton
          title="Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.authButton}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tickets</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item, index) => String(item?.id || item?._id || index)}
        renderItem={({ item }) => <TicketCard booking={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tickets found</Text>
            <Text style={styles.emptySubtext}>
              You haven't booked any tickets yet. Explore events and book your first ticket!
            </Text>
            {/* ✅ Navigate safely into Events tab, EventsList screen */}
            <CustomButton
              title="Browse Events"
              onPress={() =>
                navigation.navigate('Events', { screen: 'EventsList' })
              }
              style={styles.emptyButton}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  authButton: {
    width: '60%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    width: '70%',
  },
});

export default MyTicketsScreen;

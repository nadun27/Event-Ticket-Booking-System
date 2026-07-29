import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, Card, Button, Chip } from 'react-native-paper';
import TicketCard from '../../components/TicketCard';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const ManageBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get(ENDPOINTS.BOOKINGS.LIST);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`${ENDPOINTS.BOOKINGS.UPDATE}/${bookingId}`, { status });
      
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      
      Alert.alert('Success', `Booking ${status} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  const handleStatusUpdate = (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 
                     currentStatus === 'confirmed' ? 'cancelled' : 'pending';
    
    Alert.alert(
      'Update Status',
      `Change booking status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => updateBookingStatus(bookingId, newStatus)
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search bookings..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={styles.chips}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
            <Chip
              key={status}
              selected={statusFilter === status}
              onPress={() => setStatusFilter(status)}
              style={styles.chip}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.bookingCard}>
            <TicketCard booking={item} />
            <Card.Actions>
              <Button 
                onPress={() => handleStatusUpdate(item.id, item.status)}
                textColor={getStatusColor(
                  item.status === 'pending' ? 'confirmed' : 
                  item.status === 'confirmed' ? 'cancelled' : 'pending'
                )}
              >
                Mark as {
                  item.status === 'pending' ? 'Confirmed' : 
                  item.status === 'confirmed' ? 'Cancelled' : 'Pending'
                }
              </Button>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 10,
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookingCard: {
    margin: 8,
    elevation: 4,
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
    fontSize: 16,
    color: '#666',
  },
});

export default ManageBookingsScreen;
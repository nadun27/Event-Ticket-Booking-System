import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const TicketCard = ({ booking }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.eventName}>{booking.eventName}</Text>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(booking.eventDate)}</Text>
          <Text style={styles.time}>{booking.eventTime}</Text>
        </View>
        <View style={styles.ticketInfo}>
          <Text style={styles.quantity}>Tickets: {booking.quantity}</Text>
          <Text style={styles.category}>Category: {booking.ticketCategory}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.status, 
            booking.status === 'confirmed' ? styles.confirmed : 
            booking.status === 'pending' ? styles.pending : styles.cancelled
          ]}>
            {booking.status.toUpperCase()}
          </Text>
          <Text style={styles.total}>Total: ${booking.totalAmount}</Text>
        </View>
        <Text style={styles.bookingId}>Booking ID: {booking.bookingId}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 3,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
  },
  category: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
});

export default TicketCard;
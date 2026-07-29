import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const EventDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('regular');

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`${ENDPOINTS.EVENTS.DETAILS}/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTickets = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please login to book tickets',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    navigation.navigate('Booking', {
      eventId: event.id,
      ticketCount,
      category: selectedCategory,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTicketPrice = (category) => {
    switch (category) {
      case 'vip':
        return event.ticketPrice?.vip || event.price * 1.5;
      case 'premium':
        return event.ticketPrice?.premium || event.price * 2;
      default:
        return event.ticketPrice?.regular || event.price;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }

  const currentPrice = getTicketPrice(selectedCategory);
  const totalPrice = currentPrice * ticketCount;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: event.imageUrl || 'https://via.placeholder.com/400x300',
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{event.name}</Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{formatTime(event.time)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Organizer:</Text>
              <Text style={styles.infoValue}>{event.organizer}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.descriptionCard}>
          <Card.Content>
            <Text style={styles.descriptionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </Card.Content>
        </Card>

        {isAuthenticated && (
          <Card style={styles.bookingCard}>
            <Card.Content>
              <Text style={styles.bookingTitle}>Book Tickets</Text>

              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Ticket Category:</Text>
                <View style={styles.categoryButtons}>
                  {['regular', 'vip', 'premium'].map((category) => (
                    <Button
                      key={category}
                      mode={
                        selectedCategory === category ? 'contained' : 'outlined'
                      }
                      onPress={() => setSelectedCategory(category)}
                      style={styles.categoryButton}
                    >
                      {category.toUpperCase()}
                    </Button>
                  ))}
                </View>
              </View>

              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Number of Tickets:</Text>
                <View style={styles.ticketControls}>
                  <Button
                    mode="outlined"
                    onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </Button>
                  <Text style={styles.ticketCount}>{ticketCount}</Text>
                  <Button
                    mode="outlined"
                    onPress={() => setTicketCount(ticketCount + 1)}
                    disabled={ticketCount >= 10}
                  >
                    +
                  </Button>
                </View>
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Price per ticket:</Text>
                <Text style={styles.price}>${currentPrice}</Text>
              </View>

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>${totalPrice}</Text>
              </View>

              <CustomButton
                title="Book Now"
                onPress={handleBookTickets}
                style={styles.bookButton}
              />
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  infoValue: {
    color: '#333',
  },
  descriptionCard: {
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    lineHeight: 20,
    color: '#666',
  },
  bookingCard: {
    marginBottom: 20,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bookingSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  ticketControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  ticketCount: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventDetailsScreen;

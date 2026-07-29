import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId, ticketCount, category } = route.params;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequirements: ''
  });

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        eventId,
        ticketCount,
        ticketCategory: category,
        customerDetails: formData,
        totalAmount: calculateTotal()
      };

      const response = await api.post(ENDPOINTS.BOOKINGS.CREATE, bookingData);
      
      Alert.alert(
        'Booking Successful!',
        `Your booking has been confirmed. Booking ID: ${response.data.bookingId}`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Tickets') 
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', 'There was an error processing your booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;
    const price = event.ticketPrice?.[category] || event.price;
    return price * ticketCount;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Your Booking</Text>
        <Text style={styles.subtitle}>{event.name}</Text>
      </View>

      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Event:</Text>
          <Text style={styles.summaryValue}>{event.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Date & Time:</Text>
          <Text style={styles.summaryValue}>
            {formatDate(event.date)} at {event.time}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Location:</Text>
          <Text style={styles.summaryValue}>{event.location}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tickets:</Text>
          <Text style={styles.summaryValue}>
            {ticketCount} x {category.toUpperCase()}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total Amount:</Text>
          <Text style={styles.totalAmount}>${calculateTotal()}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Customer Details</Text>
        
        <TextInput
          label="First Name *"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Last Name *"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="Email *"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
        />
        
        <TextInput
          label="Phone"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />
        
        <TextInput
          label="Special Requirements"
          value={formData.specialRequirements}
          onChangeText={(value) => handleInputChange('specialRequirements', value)}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      </View>

      <CustomButton
        title="Confirm Booking"
        onPress={handleBooking}
        loading={bookingLoading}
        style={styles.bookButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  bookingSummary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  bookButton: {
    marginBottom: 20,
  },
});

export default BookingScreen;
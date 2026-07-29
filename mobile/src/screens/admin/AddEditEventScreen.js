import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const AddEditEventScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    time: new Date(),
    location: '',
    organizer: '',
    imageUrl: '',
    ticketPrice: {
      regular: '',
      vip: '',
      premium: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (event) {
      // Populate form with event data for editing
      setFormData({
        name: event.name || '',
        description: event.description || '',
        date: new Date(event.date) || new Date(),
        time: new Date(`1970-01-01T${event.time}`) || new Date(),
        location: event.location || '',
        organizer: event.organizer || '',
        imageUrl: event.imageUrl || '',
        ticketPrice: {
          regular: event.ticketPrice?.regular?.toString() || event.price?.toString() || '',
          vip: event.ticketPrice?.vip?.toString() || '',
          premium: event.ticketPrice?.premium?.toString() || ''
        }
      });
    }
  }, [event]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  const validateForm = () => {
    const required = ['name', 'description', 'location', 'organizer'];
    for (const field of required) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in the ${field} field`);
        return false;
      }
    }
    
    if (!formData.ticketPrice.regular) {
      Alert.alert('Error', 'Please set a regular ticket price');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time.toTimeString().split(' ')[0].substring(0, 5),
        ticketPrice: {
          regular: parseFloat(formData.ticketPrice.regular),
          vip: formData.ticketPrice.vip ? parseFloat(formData.ticketPrice.vip) : null,
          premium: formData.ticketPrice.premium ? parseFloat(formData.ticketPrice.premium) : null
        }
      };

      if (event) {
        // Update existing event
        await api.put(`${ENDPOINTS.EVENTS.UPDATE}/${event.id}`, submitData);
        Alert.alert('Success', 'Event updated successfully');
      } else {
        // Create new event
        await api.post(ENDPOINTS.EVENTS.CREATE, submitData);
        Alert.alert('Success', 'Event created successfully');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {event ? 'Edit Event' : 'Add New Event'}
      </Text>

      <TextInput
        label="Event Name *"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Description *"
        value={formData.description}
        onChangeText={(value) => handleInputChange('description', value)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {formData.date.toLocaleDateString()}
          </Button>
        </View>
        
        <View style={styles.halfInput}>
          <Button 
            mode="outlined" 
            onPress={() => setShowTimePicker(true)}
            style={styles.dateButton}
          >
            {formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TextInput
        label="Location *"
        value={formData.location}
        onChangeText={(value) => handleInputChange('location', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Organizer *"
        value={formData.organizer}
        onChangeText={(value) => handleInputChange('organizer', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Image URL"
        value={formData.imageUrl}
        onChangeText={(value) => handleInputChange('imageUrl', value)}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Ticket Prices</Text>

      <TextInput
        label="Regular Price *"
        value={formData.ticketPrice.regular}
        onChangeText={(value) => handleInputChange('ticketPrice.regular', value)}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="VIP Price"
        value={formData.ticketPrice.vip}
        onChangeText={(value) => handleInputChange('ticketPrice.vip', value)}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Premium Price"
        value={formData.ticketPrice.premium}
        onChangeText={(value) => handleInputChange('ticketPrice.premium', value)}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <CustomButton
        title={event ? 'Update Event' : 'Create Event'}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  dateButton: {
    height: 56,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
  },
});

export default AddEditEventScreen;
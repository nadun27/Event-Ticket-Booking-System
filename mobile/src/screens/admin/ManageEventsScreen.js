import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, FAB, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../../components/EventCard';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const ManageEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const fetchEvents = async () => {
    try {
      const response = await api.get(ENDPOINTS.EVENTS.LIST);
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEvent(eventId)
        }
      ]
    );
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`${ENDPOINTS.EVENTS.DELETE}/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
      Alert.alert('Success', 'Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  const handleEditEvent = (event) => {
    navigation.navigate('AddEditEvent', { event });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search events..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.eventCard}>
            <EventCard event={item} showBookButton={false} />
            <Card.Actions>
              <Button onPress={() => handleEditEvent(item)}>
                Edit
              </Button>
              <Button 
                onPress={() => handleDeleteEvent(item.id)}
                textColor="#ff4444"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditEvent')}
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
  listContent: {
    paddingBottom: 20,
  },
  eventCard: {
    margin: 8,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageEventsScreen;
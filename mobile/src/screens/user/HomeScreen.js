import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/EventCard';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const HomeScreen = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();

  const fetchEvents = async () => {
  try {
    const response = await api.get(ENDPOINTS.EVENTS.LIST);
    let events = response.data;

    // normalize response
    if (!Array.isArray(events)) {
      if (Array.isArray(response.data?.data)) {
        events = response.data.data;
      } else if (Array.isArray(response.data?.events)) {
        events = response.data.events;
      } else {
        events = []; // fallback
      }
    }

    setFeaturedEvents(events.slice(0, 3));
    setUpcomingEvents(events.slice(3, 9));
  } catch (err) {
    console.error("Error fetching events:", err);
    setFeaturedEvents([]);
    setUpcomingEvents([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleEventPress = (event) => {
    navigation.navigate('Events', { 
      screen: 'EventDetails',
      params: { eventId: event.id }
    });
  };

  const getGreetingName = () => {
    if (!user) return 'Guest';
    return user.firstName || user.name || user.email || 'User';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {isAuthenticated ? `Hello, ${getGreetingName()}!` : 'Hello, Guest!'}
        </Text>
        <Text style={styles.subtitle}>Discover amazing events around you</Text>
      </View>

      {/* Auth prompt */}
      {!isAuthenticated && (
        <View style={styles.authPrompt}>
          <Text style={styles.authText}>
            Login to book tickets and access exclusive features
          </Text>
          <CustomButton
            title="Login / Register"
            onPress={() => navigation.navigate('Welcome')}
            style={styles.authButton}
          />
        </View>
      )}

      {/* Featured Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Featured Events</Text>
        {featuredEvents.length > 0 ? (
          featuredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No featured events available</Text>
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming events available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  authPrompt: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    margin: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  authText: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    width: '65%',
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#777',
    paddingVertical: 8,
  },
});

export default HomeScreen;

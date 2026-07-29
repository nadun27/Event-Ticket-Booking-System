import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  Alert,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';

const { height } = Dimensions.get('window');

// ---- Helpers ----
const toArray = (val) => (Array.isArray(val) ? val : []);
const str = (v) => (typeof v === 'string' ? v : '');
const idOf = (e) =>
  e?.id?.toString() ||
  e?._id?.toString() ||
  e?.eventId?.toString() ||
  e?.code?.toString() ||
  '';

const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return '';
};

// ---- Component ----
const EventsScreen = ({ navigation }) => {
  const route = useRoute();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await api.get(ENDPOINTS.EVENTS.LIST);
      console.log('📦 Events API Response:', response.data);

      let eventsData = [];
      if (Array.isArray(response.data)) {
        eventsData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        eventsData = response.data.data;
      } else if (Array.isArray(response.data?.events)) {
        eventsData = response.data.events;
      } else {
        console.warn('⚠️ Unexpected events response shape:', response.data);
      }

      const arr = toArray(eventsData);
      setEvents(arr);
      setFilteredEvents(arr);
    } catch (error) {
      console.error('❌ Error fetching events:', error?.message || error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedQuery = useMemo(() => searchQuery.trim().toLowerCase(), [searchQuery]);

  useEffect(() => {
    if (!normalizedQuery) {
      setFilteredEvents(events);
      return;
    }

    const next = toArray(events).filter((e) => {
      const name = pick(e, ['name', 'title', 'eventName']);
      const place = pick(e, ['location', 'venue', 'city']);
      const description = str(e?.description);

      return (
        str(name).toLowerCase().includes(normalizedQuery) ||
        str(place).toLowerCase().includes(normalizedQuery) ||
        description.toLowerCase().includes(normalizedQuery)
      );
    });

    setFilteredEvents(next);
  }, [normalizedQuery, events]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleEventPress = (event) => {
    const eventId = idOf(event);
    if (!eventId) {
      Alert.alert('Error', 'Invalid event data.');
      return;
    }

    if (route?.name === 'EventsList' || route?.name === 'Events') {
      navigation.navigate('EventDetails', { eventId });
    } else {
      navigation.navigate('Events', {
        screen: 'EventDetails',
        params: { eventId },
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover Events</Text>
        <Text style={styles.subtitle}>Explore and book tickets for the best experiences</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder="Search events..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#007AFF"
          inputStyle={{ fontSize: 16 }}
        />
      </View>

      {/* Events List */}
      <FlatList
        data={toArray(filteredEvents)}
        keyExtractor={(item, index) => idOf(item) || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventCard event={item} onPress={() => handleEventPress(item)} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {normalizedQuery
                ? 'No events found matching your search'
                : 'No events available'}
            </Text>
          </View>
        }
        contentContainerStyle={
          toArray(filteredEvents).length === 0 ? styles.emptyList : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert('Coming soon', 'Event creation feature!')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9ff', minHeight: height },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#e3f2fd', marginTop: 5, textAlign: 'center' },
  searchWrapper: { marginHorizontal: 20, marginBottom: 10 },
  searchBar: {
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardWrapper: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  listContent: { paddingBottom: 100 },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyContainer: { alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
});

export default EventsScreen;

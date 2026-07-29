import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { UPLOADS_BASE_URL } from '../constants/config';

const isValidUrl = (uri) => {
  if (typeof uri !== 'string') return false;
  return (
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('data:image')
  );
};

const EventCard = ({ event = {}, onPress, showBookButton = true }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (event?.id) {
      navigation.navigate('Events', {
        screen: 'EventDetails',
        params: { eventId: event.id },
      });
    }
  };

  const title = event?.name || event?.title || event?.eventName || 'Untitled Event';
  const dateValue = event?.date || event?.eventDate || event?.startDate || null;
  const timeValue = event?.time || event?.startTime || null;
  const locationText = event?.location || event?.venue || event?.city || 'Location TBA';

  // ✅ Fix for local backend images
  const imagePath = event?.imageUrl || event?.image || event?.bannerUrl;
  const imageUri = isValidUrl(imagePath)
    ? imagePath
    : `${UPLOADS_BASE_URL}${imagePath || '/uploads/events/placeholder.jpg'}`;

  const rawPrice =
    (event?.ticketPrice &&
      (event?.ticketPrice?.regular ?? event?.ticketPrice?.price)) ??
    event?.price ??
    event?.minPrice ??
    event?.startingPrice ??
    null;

  const formatPrice = (p) => {
    if (p == null) return 'N/A';
    const num = Number(p);
    if (Number.isFinite(num)) return num.toFixed(2);
    return String(p);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Date TBA';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBA';
    const safeTime = /^\d{2}:\d{2}(:\d{2})?$/.test(timeString)
      ? `${timeString.length === 5 ? `${timeString}:00` : timeString}`
      : '00:00:00';
    const time = new Date(`1970-01-01T${safeTime}Z`);
    if (Number.isNaN(time.getTime())) return 'Time TBA';
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card} onPress={handlePress} testID="event-card">
      <Card.Cover source={{ uri: imageUri }} style={styles.image} />
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>
          {`${formatDate(dateValue)} • ${formatTime(timeValue)}`}
        </Text>
        <Text style={styles.location}>{locationText}</Text>
        <Text style={styles.price}>From ${formatPrice(rawPrice)}</Text>
        {event?.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {String(event.description)}
          </Text>
        ) : (
          <Text style={styles.descriptionPlaceholder}>
            No description available
          </Text>
        )}
      </Card.Content>
      {showBookButton && (
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={handlePress}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            View Details
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 12,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
  },
  image: {
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  descriptionPlaceholder: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#aaa',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EventCard;

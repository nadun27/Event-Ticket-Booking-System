import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from '../screens/user/EventsScreen';
import EventDetailsScreen from '../screens/user/EventDetailsScreen';

const Stack = createNativeStackNavigator();

const EventsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventsList"
        component={EventsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
    </Stack.Navigator>
  );
};

export default EventsNavigator;

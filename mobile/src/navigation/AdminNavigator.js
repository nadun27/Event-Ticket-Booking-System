import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageEventsScreen from '../screens/admin/ManageEventsScreen';
import ManageBookingsScreen from '../screens/admin/ManageBookingsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Drawer = createDrawerNavigator();

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#007AFF',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={AdminDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ManageEvents" 
        component={ManageEventsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ManageBookings" 
        component={ManageBookingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={AdminProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;

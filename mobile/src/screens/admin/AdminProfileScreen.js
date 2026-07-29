import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';

const AdminProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        }
      ]
    );
  };

  const adminStats = [
    { label: 'Total Events Managed', value: '47' },
    { label: 'Active Bookings', value: '128' },
    { label: 'Revenue This Month', value: '$12,450' },
    { label: 'User Satisfaction', value: '94%' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>ADMINISTRATOR</Text>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Admin Statistics</Text>
          <View style={styles.statsGrid}>
            {adminStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Events')}
          >
            Manage Events
          </Button>
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Bookings')}
          >
            View Bookings
          </Button>
          <Button 
            mode="outlined" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddEditEvent')}
          >
            Add New Event
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.systemCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>System Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Login:</Text>
            <Text style={styles.infoValue}>Today, 14:30</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admin Since:</Text>
            <Text style={styles.infoValue}>January 2024</Text>
          </View>
        </Card.Content>
      </Card>

      <CustomButton
        title="Logout"
        onPress={handleLogout}
        variant="secondary"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  role: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    fontWeight: 'bold',
  },
  statsCard: {
    margin: 10,
  },
  actionsCard: {
    margin: 10,
  },
  systemCard: {
    margin: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    color: '#333',
  },
  logoutButton: {
    margin: 20,
  },
});

export default AdminProfileScreen;
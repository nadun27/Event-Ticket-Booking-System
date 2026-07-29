import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingSpinner;
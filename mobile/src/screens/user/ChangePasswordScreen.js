// frontend/screens/user/ChangePasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/config';
import { authService } from '../../services/auth';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.getCurrentUser();

      const res = await api.put(`${ENDPOINTS.USERS.PROFILE}/${user.id}`, {
        password: currentPassword,
        newPassword: newPassword,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Password updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', res.data.message || 'Password update failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Error', 'Unable to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        mode="contained"
        onPress={handleChangePassword}
        loading={loading}
        style={styles.button}
      >
        Update Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: { marginTop: 10, backgroundColor: '#007AFF' },
});

export default ChangePasswordScreen;

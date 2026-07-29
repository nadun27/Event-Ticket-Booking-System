import api from './api';
import { ENDPOINTS } from '../constants/config';
import { storeToken, storeUser, clearStorage, retrieveToken, retrieveUser } from './storage';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;

      // Store token + user
      await storeToken(token);
      await storeUser(user);

      return { success: true, user, token };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await clearStorage();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  },

  // Get profile (current logged-in user)
  getProfile: async () => {
    try {
      const response = await api.get(ENDPOINTS.AUTH.PROFILE);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Profile error:', error);
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    const token = await retrieveToken();
    return !!token;
  },

  // Get current user from storage
  getCurrentUser: async () => {
    const user = await retrieveUser();
    return user || null;
  },
};

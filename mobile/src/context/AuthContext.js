import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import { retrieveUser, retrieveToken, storeUser, storeToken, clearStorage } from '../services/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await retrieveToken();
      const userData = await retrieveUser();

      if (token && userData) {
        setUser(userData);

        if (userData.role === 'guest') {
          setIsGuest(true);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setIsGuest(false);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      // Store user + token for persistence
      await storeUser(result.user);
      await storeToken(result.token);

      setUser(result.user);
      setIsAuthenticated(true);
      setIsGuest(false);
    }

    return result;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    await clearStorage(); // ✅ clear token + user
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  const loginAsGuest = async () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '',
      role: 'guest',
      isGuest: true,
    };

    await storeUser(guestUser);
    await storeToken('guest_token');

    setUser(guestUser);
    setIsGuest(true);
    setIsAuthenticated(false);

    return { success: true, user: guestUser };
  };

  const updateUser = async (userData) => {
    setUser(userData);
    await storeUser(userData);

    if (userData.role !== 'guest') {
      setIsGuest(false);
      setIsAuthenticated(true);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isGuest,
    login,
    register,
    logout,
    loginAsGuest,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
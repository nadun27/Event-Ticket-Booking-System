import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';

const AppNavigator = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [isGuest, setIsGuest] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If guest mode or authenticated user
  if (isGuest || isAuthenticated) {
    if (user?.role === 'admin') {
      return <AdminNavigator />;
    }
    return <UserNavigator />;
  }

  // Show auth screens for non-authenticated, non-guest users
  return <AuthNavigator />;
};

export default AppNavigator;
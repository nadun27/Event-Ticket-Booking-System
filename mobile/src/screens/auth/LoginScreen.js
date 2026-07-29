import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';   // ✅ use context

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const { login } = useAuth();   // ✅ from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);  // ✅ use AuthContext
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
      // ✅ No navigation needed — AppNavigator will switch to UserNavigator → Home
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Please contact support to reset your password.');
  };

  const handleQuickLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="ticket" size={40} color="#fff" />
          </View>
          <Text style={styles.title}>EventTicket</Text>
          <Text style={styles.subtitle}>Welcome Back! Sign in to continue</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login to Your Account</Text>

          {/* Email */}
          <View style={[styles.inputContainer, isFocused.email && styles.inputFocused]}>
            <Ionicons 
              name="mail-outline" 
              size={22} 
              color={isFocused.email ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputContainer, isFocused.password && styles.inputFocused]}>
            <Ionicons 
              name="lock-closed-outline" 
              size={22} 
              color={isFocused.password ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="flat"
              secureTextEntry={!showPassword}
              style={styles.input}
              theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                  color={isFocused.password ? '#007AFF' : '#666'}
                />
              }
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Quick Demo Access */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Access:</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity 
                style={styles.demoButton}
                onPress={() => handleQuickLogin('user@demo.com', 'password123')}
              >
                <Ionicons name="person-outline" size={16} color="#fff" />
                <Text style={styles.demoButtonText}>User Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.demoButton, styles.adminDemoButton]}
                onPress={() => handleQuickLogin('admin@demo.com', 'admin123')}
              >
                <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
                <Text style={styles.demoButtonText}>Admin Demo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign up link */}
          <TouchableOpacity onPress={() => Alert.alert('Redirect', 'Go to Register screen')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 50,
    fontSize: 16,
    height: 60,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    marginTop: -10,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 56,
    borderRadius: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  adminDemoButton: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;

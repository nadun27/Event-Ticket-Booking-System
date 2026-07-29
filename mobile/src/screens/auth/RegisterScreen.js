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
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/auth';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });
  const navigation = useNavigation();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (!validatePasswordStrength(password)) {
      Alert.alert('Error', 'Password should include uppercase, lowercase, numbers, and special characters');
      return false;
    }

    return true;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    return strongRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, color: '#ddd', text: '' };
    if (password.length < 6) return { strength: 25, color: '#ff4444', text: 'Weak' };
    if (!validatePasswordStrength(password)) return { strength: 50, color: '#ffaa00', text: 'Fair' };
    return { strength: 100, color: '#00C851', text: 'Strong' };
  };

 const handleRegister = async () => {
  if (!validateForm()) return;

  setLoading(true);
  const result = await authService.register({
    name: `${formData.firstName} ${formData.lastName}`,  // <-- backend needs this
    email: formData.email,
    password: formData.password,
    phone: formData.phone
  });
  setLoading(false);

  if (result.success) {
    Alert.alert('Success', 'Registration successful! Please login.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  } else {
    Alert.alert('Registration Failed', result.error);
  }
};


  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Background with gradient effect using CSS */}
      <View style={styles.background}>
        <View style={styles.backgroundTop} />
        <View style={styles.backgroundMiddle} />
        <View style={styles.backgroundBottom} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={40} color="#fff" />
            </View>
            <Text style={styles.appName}>Join EventTicket</Text>
          </View>
          <Text style={styles.welcomeText}>Create Your Account</Text>
          <Text style={styles.subtitle}>Start your event journey with us</Text>
        </View>

        {/* Registration Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create New Account</Text>
          
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={[styles.nameInputContainer, isFocused.firstName && styles.inputContainerFocused]}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={isFocused.firstName ? '#007AFF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
                mode="flat"
                style={styles.nameInput}
                theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
                onFocus={() => handleFocus('firstName')}
                onBlur={() => handleBlur('firstName')}
              />
            </View>

            <View style={[styles.nameInputContainer, isFocused.lastName && styles.inputContainerFocused]}>
              <TextInput
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
                mode="flat"
                style={styles.nameInput}
                theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
                onFocus={() => handleFocus('lastName')}
                onBlur={() => handleBlur('lastName')}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={[styles.inputContainer, isFocused.email && styles.inputContainerFocused]}>
            <Ionicons 
              name="mail-outline" 
              size={22} 
              color={isFocused.email ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
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

          {/* Phone Input */}
          <View style={[styles.inputContainer, isFocused.phone && styles.inputContainerFocused]}>
            <Ionicons 
              name="call-outline" 
              size={20} 
              color={isFocused.phone ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Phone Number (Optional)"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              mode="flat"
              keyboardType="phone-pad"
              style={styles.input}
              theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, isFocused.password && styles.inputContainerFocused]}>
            <Ionicons 
              name="lock-closed-outline" 
              size={22} 
              color={isFocused.password ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
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

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.passwordStrengthBar}>
                <View 
                  style={[
                    styles.passwordStrengthFill, 
                    { width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }
                  ]} 
                />
              </View>
              <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                {passwordStrength.text}
              </Text>
            </View>
          )}

          {/* Confirm Password Input */}
          <View style={[
            styles.inputContainer, 
            isFocused.confirmPassword && styles.inputContainerFocused,
            formData.confirmPassword.length > 0 && !passwordsMatch && styles.inputContainerError
          ]}>
            <Ionicons 
              name="lock-closed-outline" 
              size={22} 
              color={isFocused.confirmPassword ? '#007AFF' : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              mode="flat"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              theme={{ colors: { primary: '#007AFF', background: 'transparent' } }}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  color={isFocused.confirmPassword ? '#007AFF' : '#666'}
                />
              }
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
            />
          </View>

          {/* Password Match Indicator */}
          {formData.confirmPassword.length > 0 && (
            <View style={styles.passwordMatchContainer}>
              <Ionicons 
                name={passwordsMatch ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={passwordsMatch ? '#00C851' : '#ff4444'} 
              />
              <Text style={[styles.passwordMatchText, { color: passwordsMatch ? '#00C851' : '#ff4444' }]}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our {' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and {' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Register Button */}
          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
            variant="primary"
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Registration Options */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, styles.googleButtonText]}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
              <Ionicons name="logo-facebook" size={20} color="#4267B2" />
              <Text style={[styles.socialButtonText, styles.facebookButtonText]}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign in here
            </Text>
          </Text>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0 • Event Management System</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundTop: {
    height: '30%',
    backgroundColor: '#007AFF',
  },
  backgroundMiddle: {
    height: '40%',
    backgroundColor: '#0056CC',
  },
  backgroundBottom: {
    height: '30%',
    backgroundColor: '#003399',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  nameInputContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  nameInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 60,
  },
  inputContainer: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: '#ff4444',
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
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'all 0.3s ease',
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  passwordMatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  passwordMatchText: {
    fontSize: 12,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: 20,
    height: 56,
    borderRadius: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  googleButton: {
    backgroundColor: 'rgba(219, 68, 55, 0.1)',
    borderColor: 'rgba(219, 68, 55, 0.3)',
  },
  facebookButton: {
    backgroundColor: 'rgba(66, 103, 178, 0.1)',
    borderColor: 'rgba(66, 103, 178, 0.3)',
  },
  socialButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  googleButtonText: {
    color: '#DB4437',
  },
  facebookButtonText: {
    color: '#4267B2',
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loginLink: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    letterSpacing: 0.5,
  },
});

export default RegisterScreen;
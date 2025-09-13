import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Animated,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation, route }) => {
  // Since setAuthState is modified in the login function, we don't need to destructure it here
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });
  
  // Store return navigation parameters
  const [returnTo, setReturnTo] = useState(null);
  const [returnParams, setReturnParams] = useState({});
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Check if there's a screen parameter to show login or signup
  // and store return navigation info
  useEffect(() => {
    // Default to login screen unless explicitly told to show register
    const showRegister = route.params?.screen === 'Register';
    setIsLogin(!showRegister);
    
    // Animate to the correct screen
    Animated.timing(slideAnim, {
      toValue: showRegister ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Store return navigation info
    if (route.params?.returnTo) {
      setReturnTo(route.params.returnTo);
    }
    if (route.params?.returnParams) {
      setReturnParams(route.params.returnParams);
    }
  }, [route.params]);
  
  const toggleForm = () => {
    const toValue = isLogin ? 1 : 0;
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsLogin(!isLogin);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Navigate back to the original screen or LocalMarket
  // Using context to update authentication state without explicit navigation
  const navigateAfterAuth = (responseData) => {
    console.log('Auth successful, handling navigation');
    
    // Force a small delay to allow auth state to fully update
    setTimeout(() => {
      try {
        // If we have returnTo parameters, we should use them
        if (returnTo) {
          console.log(`Navigating to ${returnTo} with params:`, returnParams);
          
          // Use reset for a clean navigation state
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'HomeTab' } }],
          });
          
          // Then navigate to the specific screen if it's not MainTabs
          if (returnTo !== 'MainTabs') {
            setTimeout(() => {
              navigation.navigate(returnTo, returnParams);
            }, 100);
          }
        } else {
          // Default navigation to MainTabs/HomeTab
          console.log('Navigating to MainTabs/HomeTab (default path)');
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'HomeTab' } }],
          });
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback navigation if the above fails
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    }, 300); // Short delay to ensure auth state is updated
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      if (isLogin) {
        // Login validation
        if (!formData.email || !formData.password) {
          Alert.alert('Error', 'Please fill in all fields');
          setIsLoading(false);
          return;
        }
        
        if (!validateEmail(formData.email)) {
          Alert.alert('Error', 'Please enter a valid email');
          setIsLoading(false);
          return;
        }
        
        const payload = {
          email: formData.email,
          password: formData.password,
        };
        
        const response = await login(payload);
        console.log('Login response:', response);
        
        if (response?.success) {
          // Call navigation function with response data
          navigateAfterAuth(response.data);
        } else {
          Alert.alert('Error', response?.message || 'Login failed. Please check your credentials.');
        }
      } else {
        // Registration validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone_number) {
          Alert.alert('Error', 'Please fill in all fields');
          setIsLoading(false);
          return;
        }
        
        if (!validateEmail(formData.email)) {
          Alert.alert('Error', 'Please enter a valid email');
          setIsLoading(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
        if (formData.phone_number.length < 10) {
          Alert.alert('Error', 'Phone number must be at least 10 digits long');
          setIsLoading(false);
          return;
        }

        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number
        };
        
        const response = await register(payload);
        
        if (response?.success) {
          Alert.alert(
            'Success', 
            'Account created successfully! Please login.',
            [{ 
              text: 'OK', 
              onPress: () => {
                // Clear signup form data but keep email for login convenience
                const email = formData.email;
                setFormData({
                  name: '',
                  email,
                  password: '',
                  confirmPassword: '',
                  phone_number: '',
                });
                
                // Switch to login form
                setIsLogin(true);
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }
            }]
          );
        } else {
          Alert.alert('Error', response?.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in attempt');
    Alert.alert('Google Sign In', 'Google authentication would be implemented here');
  };

  const loginTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width]
  });

  const signupTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0]
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
        >
          <View style={styles.header}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/891/891462.png' }} 
              style={styles.logo} 
            />
            <Text style={styles.appTitle}>LocalMarket</Text>
            <Text style={styles.appTagline}>Your neighborhood marketplace</Text>
          </View>
          
          <View style={styles.formWrapper}>
            {/* Login Form */}
            <Animated.View style={[
              styles.formContainer,
              {
                transform: [{ translateX: loginTranslateX }]
              }
            ]}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>Sign in to continue</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/561/561127.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry
                  />
                </View>
                
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Login</Text>
                  )}
                </TouchableOpacity>
                
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                
                <View style={styles.switchFormContainer}>
                  <Text style={styles.switchFormText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={toggleForm}>
                    <Text style={styles.switchFormLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Sign Up Form */}
            <Animated.View style={[
              styles.formContainer,
              styles.signupForm,
              {
                transform: [{ translateX: signupTranslateX }]
              }
            ]}>
              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>Sign up to get started</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    autoCapitalize="words"
                  />
                </View>
                
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/561/561127.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry
                  />
                </View>
                
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/483/483947.png' }} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#9CA3AF"
                    value={formData.phone_number}
                    onChangeText={(text) => handleInputChange('phone_number', text)}
                    keyboardType="phone-pad"
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
                
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                
                {/* Login link section with enhanced visibility */}
                <View style={styles.switchFormContainer}>
                  <Text style={styles.switchFormText}>Already have an account? </Text>
                  <TouchableOpacity onPress={toggleForm} style={{padding: 5}}>
                    <Text style={styles.switchFormLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.backgroundPattern} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 80, // Increased bottom padding significantly
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
    tintColor: '#1E3A8A',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  appTagline: {
    fontSize: 14,
    color: '#6B7280',
  },
  formWrapper: {
    width: width - 40,
    height: 700, // Further increased height to ensure login text is visible
    overflow: 'hidden',
  },
  formContainer: {
    width: width - 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    paddingBottom: 50, // Added extra padding at the bottom
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 700, // Increased minimum height to ensure all content is visible
  },
  signupForm: {
    left: 0,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1F2937',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#14B8A6',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 10,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 55,
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  switchFormContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  switchFormText: {
    color: '#6B7280',
    fontSize: 16,
  },
  switchFormLink: {
    color: '#14B8A6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E3A8A',
    opacity: 0.03,
    zIndex: -1,
  },
});

export default AuthScreen;
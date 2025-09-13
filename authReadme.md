# Authentication Flow Documentation

## Overview

This document provides a comprehensive explanation of the authentication flow in the Dukaan application, detailing how various files are interconnected, the purpose of each component in the authentication process, and why specific code is necessary.

## Authentication Component Relationships

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  API Client   │◄─────►│  Auth Service │◄─────►│ AsyncStorage  │
│   (api.js)    │       │   (auth.js)   │       │               │
└───────┬───────┘       └───────┬───────┘       └───────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│ Auth Context  │◄─────►│ Login/Signup  │
│(AuthContext.js)│       │Screens/Modal  │
└───────┬───────┘       └───────────────┘
        │
        │
        ▼
┌───────────────┐
│   Protected   │
│  Components   │
└───────────────┘
```

## File-by-File Breakdown

### 1. API Client (api.js)

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.example.com';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      AsyncStorage.removeItem('auth_token');
      // Navigation handling would be done in the component or context
    }
    return Promise.reject(error);
  }
);

// Helper function to set auth token for API requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
```

#### Purpose
This file creates and configures the API client used for all network requests, including authentication.

#### Essential Code Analysis

1. **Axios Instance**: 
   - **Purpose**: Creates a configured API client with default settings.
   - **Impact if removed**: Without a centralized API client, you'd need to duplicate configuration across files, leading to inconsistency and maintenance issues.

2. **Request Interceptor**:
   - **Purpose**: Automatically adds the authentication token to each request.
   - **Impact if removed**: You'd need to manually add the token to every authenticated request, increasing the risk of forgetting to authenticate some requests.

3. **Response Interceptor**:
   - **Purpose**: Handles common error scenarios like 401 Unauthorized across the app.
   - **Impact if removed**: You'd need to handle authentication errors separately in each component.

4. **setAuthToken Function**:
   - **Purpose**: Provides a way to set or clear the authentication token globally.
   - **Impact if removed**: You'd need another mechanism to ensure the token is consistently applied to requests.

#### Potentially Unnecessary Code
- The response interceptor could be simplified if you're handling 401 errors through other means.

### 2. Auth Service (auth.js)

```javascript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from './api';

const Authentication = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Login an existing user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('auth_token', response.data.token);
        
        // Set token in API headers
        setAuthToken(response.data.token);
        
        // Store user data
        if (response.data.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Logout the current user
  logout: async () => {
    try {
      // Call logout API if available
      // await api.post('/auth/logout');
      
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('auth_token');
      
      // Remove user data
      await AsyncStorage.removeItem('user_data');
      
      // Remove token from API headers
      setAuthToken(null);
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Logout failed'
      };
    }
  },

  // Get the current user's profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return {
        success: true,
        data: response.data,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },

  // Check if user is authenticated
  checkAuthStatus: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        return {
          isAuthenticated: false,
          user: null
        };
      }
      
      // Set token in API headers
      setAuthToken(token);
      
      // Get stored user data
      const userDataString = await AsyncStorage.getItem('user_data');
      let userData = null;
      
      if (userDataString) {
        userData = JSON.parse(userDataString);
      } else {
        // If we have a token but no user data, try to fetch the profile
        const profileResponse = await Authentication.getProfile();
        if (profileResponse.success) {
          userData = profileResponse.data;
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        }
      }
      
      return {
        isAuthenticated: true,
        user: userData
      };
    } catch (error) {
      // If any error occurs, consider user not authenticated
      return {
        isAuthenticated: false,
        user: null
      };
    }
  }
};

export default Authentication;
```

#### Purpose
This service encapsulates all authentication-related API calls and token management.

#### Essential Code Analysis

1. **Register Function**:
   - **Purpose**: Handles user registration by calling the API and standardizing response format.
   - **Impact if removed**: You'd lose the centralized registration logic and need to implement it in components.

2. **Login Function**:
   - **Purpose**: Authenticates users, stores tokens, and updates API headers.
   - **Impact if removed**: The core authentication functionality would be lost.
   - **Key components**:
     - Token storage in AsyncStorage
     - Setting token in API headers
     - User data storage
     - Consistent error handling

3. **Logout Function**:
   - **Purpose**: Cleans up authentication state when users log out.
   - **Impact if removed**: Users would remain logged in even after attempting to log out.
   - **Key components**:
     - Token removal from AsyncStorage
     - User data removal
     - API header cleanup

4. **getProfile Function**:
   - **Purpose**: Fetches current user profile from the server.
   - **Impact if removed**: You couldn't retrieve user information after login.

5. **checkAuthStatus Function**:
   - **Purpose**: Verifies authentication state on app startup.
   - **Impact if removed**: The app wouldn't be able to restore user sessions across app restarts.
   - **Key components**:
     - Token retrieval and validation
     - User data restoration
     - Profile fetching when needed

#### Potentially Unnecessary Code
- The commented API call for logout might be unnecessary if your backend doesn't require explicit logout.
- Storing user data in AsyncStorage could be redundant if you always fetch fresh data from the server.

### 3. Auth Context (AuthContext.js)

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authentication from '../services/auth';
import { setAuthToken } from '../services/api';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authStatus = await Authentication.checkAuthStatus();
        
        if (authStatus.isAuthenticated) {
          const token = await AsyncStorage.getItem('auth_token');
          setAuthToken(token);
          
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: authStatus.user,
            token
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await Authentication.login(credentials);
      
      if (response?.success) {
        const token = response.data?.token;
        const user = response.data?.user;
        
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          token
        });
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response?.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await Authentication.register(userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await Authentication.logout();
      
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      // Call API to update user profile
      // const response = await api.post('/users/profile', userData);
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...userData
        }
      }));
      
      // Update stored user data
      const userString = await AsyncStorage.getItem('user_data');
      if (userString) {
        const user = JSON.parse(userString);
        await AsyncStorage.setItem('user_data', JSON.stringify({
          ...user,
          ...userData
        }));
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to update profile' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Purpose
This context provides authentication state and functions to all components in the application.

#### Essential Code Analysis

1. **Context Creation**:
   - **Purpose**: Establishes a React Context for authentication.
   - **Impact if removed**: Components wouldn't have access to authentication state.

2. **AuthProvider Component**:
   - **Purpose**: Manages authentication state and provides authentication functions.
   - **Impact if removed**: No global authentication state management.

3. **Initial Auth State**:
   - **Purpose**: Defines default authentication state with loading status.
   - **Impact if removed**: You wouldn't know when authentication initialization is complete.

4. **initializeAuth Effect**:
   - **Purpose**: Restores authentication state when the app starts.
   - **Impact if removed**: User would need to log in every time they open the app.

5. **Context Functions (login, register, logout, updateProfile)**:
   - **Purpose**: Expose authentication functions to components.
   - **Impact if removed**: Components would need to directly use the Authentication service.

6. **useAuth Hook**:
   - **Purpose**: Provides a convenient way to access auth context.
   - **Impact if removed**: Components would need to use React.useContext directly.

#### Potentially Unnecessary Code
- The updateProfile function's API call is commented out.
- Error logging in catch blocks might be redundant if you're already handling errors.

### 4. Authentication Screen (AuthenticationScreen.jsx)

```jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const AuthenticationScreen = ({ navigation, route }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // For login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Additional fields for registration
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Check if we were redirected with a specific screen to show
  useEffect(() => {
    if (route.params?.screen === 'signup') {
      setIsLogin(false);
    } else if (route.params?.screen === 'login') {
      setIsLogin(true);
    }
  }, [route.params]);
  
  // Handle login
  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Check if we need to navigate to a specific screen after login
        const redirectTo = route.params?.redirectTo;
        if (redirectTo) {
          navigation.navigate(redirectTo.routeName, redirectTo.params);
        } else {
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle registration
  const handleRegister = async () => {
    // Validate inputs
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const result = await register({
        name,
        email,
        phone,
        password
      });
      
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created. Please log in.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Clear registration fields
                setName('');
                setPhone('');
                setConfirmPassword('');
                
                // Switch to login screen
                setIsLogin(true);
              } 
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle between login and registration
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.appName}>Dukaan</Text>
        </View>
        
        <Text style={styles.headerText}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>
        <Text style={styles.subHeaderText}>
          {isLogin 
            ? 'Sign in to access your account' 
            : 'Fill in your details to get started'
          }
        </Text>
        
        <View style={styles.formContainer}>
          {/* Registration Fields */}
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}
          
          {/* Common Fields */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {/* Confirm Password for Registration */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}
          
          {/* Forgot Password Option */}
          {isLogin && (
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          
          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Toggle between Login and Register */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Styles omitted for brevity
});

export default AuthenticationScreen;
```

#### Purpose
This screen handles both login and registration functionality with form validation and user feedback.

#### Essential Code Analysis

1. **State Management**:
   - **Purpose**: Tracks form inputs, loading state, and whether showing login or signup.
   - **Impact if removed**: You couldn't collect user input or switch between forms.

2. **useEffect for Route Params**:
   - **Purpose**: Allows navigation to specify which form to show.
   - **Impact if removed**: You couldn't directly navigate to signup or login from other screens.

3. **Form Validation**:
   - **Purpose**: Ensures users provide valid inputs before submission.
   - **Impact if removed**: Could lead to server errors or invalid user data.

4. **handleLogin & handleRegister**:
   - **Purpose**: Process form submission with proper error handling.
   - **Impact if removed**: Users couldn't authenticate or create accounts.
   - **Key components**:
     - Loading state management
     - Error handling with user feedback
     - Redirection after successful operation

5. **Redirect After Login**:
   - **Purpose**: Returns users to the screen they were on before authenticating.
   - **Impact if removed**: Poor user experience after login.

6. **Success Feedback**:
   - **Purpose**: Informs users about successful operations.
   - **Impact if removed**: Users wouldn't know if their actions succeeded.

#### Potentially Unnecessary Code
- The ForgotPassword navigation might be unnecessary if that feature isn't implemented.
- Some styling properties might be redundant or could be simplified.

### 5. Login Prompt Modal (LoginPromptModal.jsx)

```jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * LoginPromptModal component - Shows a modal prompting guest users to login
 * when they try to perform actions that require authentication
 */
const LoginPromptModal = ({ visible, onClose, onLogin, onSignup }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1178/1178899.png' }} 
                style={styles.modalImage} 
              />
              
              <Text style={styles.modalTitle}>Login Required</Text>
              <Text style={styles.modalText}>
                Please login or create an account to continue with this action.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.signupButton} onPress={onSignup}>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Styles omitted for brevity
});

export default LoginPromptModal;
```

#### Purpose
This modal prompts users to log in when they attempt actions that require authentication.

#### Essential Code Analysis

1. **Modal Component**:
   - **Purpose**: Displays an overlay with authentication options.
   - **Impact if removed**: You couldn't prompt users to authenticate before restricted actions.

2. **TouchableWithoutFeedback Wrapper**:
   - **Purpose**: Allows closing the modal by tapping outside it.
   - **Impact if removed**: Users could only close the modal using the explicit close button.

3. **Authentication Options**:
   - **Purpose**: Provides Login, Signup, and Guest options.
   - **Impact if removed**: Users would have limited ways to respond to auth requirements.

4. **Callback Props**:
   - **Purpose**: Allows parent components to handle button clicks.
   - **Impact if removed**: Modal couldn't communicate with parent components.

#### Potentially Unnecessary Code
- The hardcoded image URL could be replaced with a local asset.
- Some styling properties might be redundant or could be simplified.

## Key Authentication Flow

1. **App Initialization**:
   - `AuthProvider` uses `checkAuthStatus` from `Authentication` service
   - `Authentication` service checks AsyncStorage for token
   - If token exists, sets it in API headers and loads user data
   - `AuthProvider` updates context state with authentication result

2. **Login Flow**:
   - User enters credentials in `AuthenticationScreen`
   - `handleLogin` calls `login` from `useAuth` hook
   - `AuthContext` calls `Authentication.login`
   - `Authentication` service makes API request and stores token
   - `AuthContext` updates state with user info
   - `AuthenticationScreen` navigates to appropriate screen

3. **Registration Flow**:
   - User enters information in `AuthenticationScreen`
   - `handleRegister` calls `register` from `useAuth` hook
   - `AuthContext` calls `Authentication.register`
   - On success, shows alert and switches to login form
   - User then follows login flow

4. **Authenticated Action Flow**:
   - User attempts action requiring authentication
   - Component checks `isAuthenticated` from `useAuth`
   - If not authenticated, shows `LoginPromptModal`
   - User chooses login, signup, or continue as guest
   - If login/signup, saves navigation state and redirects
   - After authentication, returns to original screen

5. **Logout Flow**:
   - User triggers logout
   - Component calls `logout` from `useAuth`
   - `AuthContext` calls `Authentication.logout`
   - `Authentication` service clears tokens and data
   - `AuthContext` updates state to reflect logged out status

## Critical Dependencies

1. **AsyncStorage**:
   - Essential for persistent authentication
   - Stores tokens and user data
   - Enables session restoration across app restarts

2. **Axios Interceptors**:
   - Automatically add authentication tokens to requests
   - Handle unauthorized errors consistently
   - Provide centralized request/response handling

3. **React Context**:
   - Provides global authentication state
   - Avoids prop drilling for auth state and functions
   - Enables components to respond to auth changes

## Optimization Opportunities

1. **Token Refresh Mechanism**:
   - Add token refresh functionality to handle expired tokens
   - Implement silent refresh to avoid disrupting user experience

2. **Biometric Authentication**:
   - Add support for Face ID/Touch ID for quicker re-authentication

3. **Error Handling Consolidation**:
   - Standardize error handling across authentication flows
   - Implement more detailed error messages for specific failure cases

4. **Caching Strategy**:
   - Implement smarter caching for user data
   - Add expiration to cached user information

5. **Code Reduction**:
   - Consolidate duplicate error handling patterns
   - Create reusable form validation utilities

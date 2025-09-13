import { setAuthToken, api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response containing success status, message, and user data
 */
const register = async ({ name, email, password, phone_number, role = 'customer' }) => {
  try {
    const response = await api.post(`/auth/register`, {
      name, 
      email, 
      password, 
      phone_number, 
      role
    });
    
    return response.data; // { success, message, data: user }
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};

/**
 * Login a user and store their authentication token
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - Response containing success status, message, and user data with token
 */
const login = async ({ email, password }) => {
  try {
    const response = await api.post(`/auth/login`, { 
      email, 
      password 
    });
    
    const data = response.data;      
    
    const token = data?.data?.token;
    if (token) {
      // Set token in axios defaults
      setAuthToken(token);
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      console.log('Auth token stored in AsyncStorage:', token);
      
      // Store user data in AsyncStorage
      if (data?.data?.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(data.data.user));
        console.log('User data stored in AsyncStorage:', data.data.user);
      }
    } else {
      console.error('No token found in login response:', data);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please check your credentials.'
    };
  }
};

/**
 * Logout a user and clear their authentication data
 * @returns {Promise<Object>} - Response indicating logout success
 */
const logout = async () => {
  try {
    // Call logout endpoint if your backend has one
    // await api.post('/auth/logout');
    
    // Clear token from axios defaults
    setAuthToken(null);
    
    // Clear token and user data from AsyncStorage
    const keysToRemove = [
      'auth_token', 
      'user_data',
      // Add any other auth-related keys that need to be cleared
      'cart_data',
      'wishlist_data'
    ];
    
    await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    const userData = await AsyncStorage.getItem('user_data');
    
    console.log('Checking auth status:');
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);
    
    if (!token) {
      console.log('No token found, user is not authenticated');
      return { isAuthenticated: false };
    }
    
    // Verify token with backend
    try { 
      // You can add a token verification endpoint in your backend
      // For now, we'll just check if the token exists
      // const response = await api.get('/auth/verify');
      // return { isAuthenticated: true, user: response.data.user };
      
      const user = userData ? JSON.parse(userData) : null;
      console.log('User is authenticated:', user);
      return { 
        isAuthenticated: true, 
        user
      };
    } catch (error) {
      // If verification fails, clear storage
      await logout();
      return { isAuthenticated: false, error: 'Token invalid' };
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return { isAuthenticated: false, error: error.message };
  }
};

export default { register, login, logout, checkAuthStatus };

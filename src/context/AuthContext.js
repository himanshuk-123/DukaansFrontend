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
      console.log('Attempting login with credentials:', credentials.email);
      const response = await Authentication.login(credentials);
      
      if (response?.success) {
        const token = response.data?.token;
        const user = response.data?.user;
        
        console.log('Login successful:', { 
          userExists: !!user, 
          tokenExists: !!token 
        });
        
        // Update auth state
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          token
        });
        
        console.log('Auth state updated after login, isAuthenticated set to TRUE');
        
        return { success: true, data: response.data };
      } else {
        console.log('Login failed:', response?.message);
        return { 
          success: false, 
          message: response?.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
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

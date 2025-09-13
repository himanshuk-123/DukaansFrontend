import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authentication from '../services/auth';
import { setAuthToken } from '../services/api';
import GlobalLoginModal from '../components/GlobalLoginModal';

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
  
  // State for the global login modal
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginModalConfig, setLoginModalConfig] = useState({
    title: 'Login Required',
    message: 'Please login or create an account to continue with this action.',
    returnTo: null,
    returnParams: {},
    feature: '',
    onClose: () => setLoginModalVisible(false)
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

  // Show login modal with configuration
  const showLoginModal = useCallback((config = {}) => {
    setLoginModalConfig({
      ...loginModalConfig,
      ...config,
      onClose: () => setLoginModalVisible(false)
    });
    setLoginModalVisible(true);
  }, [loginModalConfig]);

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
        
        // Return success with the data for any post-login processing
        return { 
          success: true,
          data: {
            user,
            token
          }
        };
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
  const logout = async (navigation) => {
    try {
      await Authentication.logout();
      
      // Clear auth state
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
      
      // If navigation is provided, reset to home screen
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'HomeTab' } }],
        });
      }
      
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

  // Check if user is authenticated, if not show login modal with appropriate configuration
  const requireAuth = useCallback((config = {}) => {
    if (!authState.isAuthenticated) {
      // Default return to LocalMarketScreen if not specified
      const configWithDefaults = {
        ...config,
        returnTo: config.returnTo || 'MainTabs',
        returnParams: config.returnParams || { screen: 'HomeTab' }
      };
      showLoginModal(configWithDefaults);
      return false;
    }
    return true;
  }, [authState.isAuthenticated, showLoginModal]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
        showLoginModal,
        requireAuth
      }}
    >
      {children}
      <GlobalLoginModal 
        visible={loginModalVisible}
        onClose={loginModalConfig.onClose}
        title={loginModalConfig.title}
        message={loginModalConfig.message}
        returnTo={loginModalConfig.returnTo}
        returnParams={loginModalConfig.returnParams}
        feature={loginModalConfig.feature}
      />
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

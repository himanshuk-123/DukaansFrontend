import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

/**
 * Higher Order Component that protects routes requiring authentication
 * @param {React.Component} Component - The component to wrap
 * @returns {React.Component} Protected component
 */
const withAuthProtection = (Component) => {
  return (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const { navigation } = props;

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        // Redirect to auth screen if not authenticated
        navigation.replace('Auth');
      }
    }, [isAuthenticated, isLoading, navigation]);

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.text}>Loading...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Please login to continue</Text>
        </View>
      );
    }

    return <Component {...props} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default withAuthProtection;

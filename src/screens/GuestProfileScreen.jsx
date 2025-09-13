import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const GuestProfileScreen = () => {
  const navigation = useNavigation();
  const { showLoginModal } = useAuth();

  // Handle login button press
  const handleLogin = () => {
    navigation.navigate('Auth', { 
      screen: 'Login',
      params: { 
        returnTo: 'MainTabs',
        returnParams: { screen: 'ProfileTab' } 
      }
    });
  };

  // Handle signup button press
  const handleSignup = () => {
    navigation.navigate('Auth', { 
      screen: 'Register',
      params: { 
        returnTo: 'MainTabs',
        returnParams: { screen: 'ProfileTab' } 
      }
    });
  };

  // Feature benefits to display
  const features = [
    {
      icon: '🛒',
      title: 'Save Shopping Cart',
      description: 'Your cart will be saved across devices and sessions.'
    },
    {
      icon: '📦',
      title: 'Order Tracking',
      description: 'Track all your orders in one place.'
    },
    {
      icon: '❤️',
      title: 'Wishlist',
      description: 'Save your favorite products for later.'
    },
    {
      icon: '🚚',
      title: 'Quick Checkout',
      description: 'Save your delivery information for faster checkout.'
    },
    {
      icon: '🎁',
      title: 'Exclusive Deals',
      description: 'Get access to member-only offers and discounts.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome to LocalMarket</Text>
        <Text style={styles.subText}>Sign in to access your profile and orders</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Benefits of creating an account</Text>
        <View style={styles.line} />
      </View>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
      >
        <Text style={styles.exploreButtonText}>Continue Browsing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  signupButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  exploreButton: {
    marginVertical: 30,
    marginHorizontal: 20,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuestProfileScreen;

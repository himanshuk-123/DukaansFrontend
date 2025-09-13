import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * GuestProfileScreen component - Shown when user is not authenticated
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Function to handle login button press
 * @param {Function} props.onSignup - Function to handle signup button press
 */
const GuestProfileScreen = ({ onLogin, onSignup }) => {
  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png' }} 
          style={styles.guestIcon}
        />
        <Text style={styles.welcomeText}>Welcome to LocalMarket</Text>
        <Text style={styles.descriptionText}>
          Sign in to view your profile, track orders, and manage your account
        </Text>
      </View>
      
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={onLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={onSignup}
        >
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.featureSection}>
        <Text style={styles.featureTitle}>Why create an account?</Text>
        
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.featureEmoji}>🛒</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureItemTitle}>Easy Shopping</Text>
            <Text style={styles.featureItemDescription}>
              Save your cart and checkout faster
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#FFF9C4' }]}>
            <Text style={styles.featureEmoji}>📦</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureItemTitle}>Track Orders</Text>
            <Text style={styles.featureItemDescription}>
              Follow your order status in real-time
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.featureEmoji}>❤️</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureItemTitle}>Save Favorites</Text>
            <Text style={styles.featureItemDescription}>
              Create a wishlist of items you love
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  upperSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  guestIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  signupButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureSection: {
    marginBottom: 30,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  featureItemDescription: {
    fontSize: 14,
    color: '#757575',
  }
});

export default GuestProfileScreen;

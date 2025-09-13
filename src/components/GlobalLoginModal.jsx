import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

/**
 * A global login prompt modal that can be shown from anywhere in the app
 * when a user tries to access a feature that requires authentication
 */
const GlobalLoginModal = ({ 
  visible, 
  onClose, 
  title = "Login Required", 
  message = "Please login or create an account to continue with this action.",
  returnTo = null,
  returnParams = {},
  feature = "" // what feature user was trying to access (e.g., "cart", "wishlist", "profile")
}) => {
  const navigation = useNavigation();
  
  // Handle login button press
  const handleLogin = () => {
    onClose();
    navigation.navigate('Auth', { 
      screen: 'Login', 
      params: { returnTo: returnTo || 'MainTabs', returnParams: returnParams || {} } 
    });
  };
  
  // Handle signup button press
  const handleSignup = () => {
    onClose();
    navigation.navigate('Auth', { 
      screen: 'Register', 
      params: { returnTo: returnTo || 'MainTabs', returnParams: returnParams || {} } 
    });
  };

  // Features benefit information
  const getFeatureBenefits = () => {
    switch(feature.toLowerCase()) {
      case 'cart':
        return "Create an account to save your shopping cart and check out faster!";
      case 'wishlist':
        return "Create an account to save your favorite items and get notifications on price drops!";
      case 'profile':
        return "Create an account to manage your orders, addresses, and personal details!";
      case 'checkout':
        return "Create an account to save your delivery details for faster checkout next time!";
      default:
        return "Create an account to enjoy all features of our app!";
    }
  };
  
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
              
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalText}>{message}</Text>
              
              {feature && (
                <Text style={styles.benefitText}>{getFeatureBenefits()}</Text>
              )}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212121',
  },
  modalText: {
    fontSize: 16,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 8,
    padding: 8,
  },
  cancelButtonText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
});

export default GlobalLoginModal;

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
    marginBottom: 24,
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

export default LoginPromptModal;

import React, { useEffect } from 'react';
import { StatusBar, Platform, View, SafeAreaView,PermissionsAndroid} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { OrderProvider } from './src/context/OrderContext';
import { initializeToken } from './src/services/api';
import messaging from '@react-native-firebase/messaging';
/**
 * Main App component
 * @returns {React.ReactElement} The app component
 */
const App = () => {
  // Initialize auth token when app starts
  useEffect(() => {
    initializeToken();
  }, []);

  useEffect(() => {
    // Request permission on mount
    const requestPermission = async () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken(); // Get the token if permission is granted
      }
    };

    requestPermission();
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <OrderProvider>
            <SafeAreaView style={{ flex: 1 }}>
              {Platform.OS === 'android' && (
                <View style={{ height: StatusBar.currentHeight, backgroundColor: '#1d740cff' }} />
              )}
              <StatusBar 
                backgroundColor="#086614ff" 
                style="light" 
                barStyle="light-content"
                hidden={false} 
                translucent={true} 
              />
              <RootNavigator />
            </SafeAreaView>
          </OrderProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};


export default App;
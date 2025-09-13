import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LocalMarketScreen from '../screens/LocalMarketScreen';
import ShopsScreen from '../screens/ShopsScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WishListScreen from '../screens/WishListScreen';
import OrderScreen from '../screens/OrderScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../context/AuthContext';
import BottomTabNavigator from './BottomTabNavigator';
import messaging from '@react-native-firebase/messaging';

// const NAVIGATION_IDS = ['home', 'post', 'settings', 'orders', 'productDetail', 'shopDetail'];

// function buildDeepLinkFromNotificationData(data) {
//   if (!data) return null;
  
//   const navigationId = data.navigationId;
//   if (!NAVIGATION_IDS.includes(navigationId)) {
//     console.warn('Unverified navigationId', navigationId);
//     return null;
//   }
  
//   switch(navigationId) {
//     case 'home':
//       return 'localmarket://home';
//     case 'settings':
//       return 'localmarket://profile';
//     case 'orders':
//       return 'localmarket://orders';
//     case 'productDetail':
//       const productId = data.productId;
//       if (typeof productId === 'string') {
//         return `localmarket://product/${productId}`;
//       }
//       console.warn('Missing productId');
//       return null;
//     case 'shopDetail':
//       const shopId = data.shopId;
//       if (typeof shopId === 'string') {
//         return `localmarket://shop/${shopId}`;
//       }
//       console.warn('Missing shopId');
//       return null;
//     default:
//       return null;
//   }
// }

// const linking = {
//   prefixes: ['localmarket://'],
//   config: {
//     screens: {
//       MainTabs: {
//         screens: {
//           HomeTab: 'home',
//           ProfileTab: 'profile',
//         }
//       },
//       Orders: 'orders',
//       ProductDetail: 'product/:id',
//       ShopDetail: 'shop/:id',
//       Auth: 'auth'
//     }
//   },
//   async getInitialURL() {
//     try {
//       // First, check if the app was opened via a deep link
//       const url = await Linking.getInitialURL();
//       if (url) {
//         console.log('App opened with URL:', url);
//         return url;
//       }
      
//       // Then check if opened from a notification when app was closed/killed
//       const message = await messaging().getInitialNotification();
//       if (message) {
//         console.log('App opened from notification (closed state):', message);
//         const deepLinkURL = buildDeepLinkFromNotificationData(message.data);
//         if (deepLinkURL) {
//           console.log('Created deep link from notification:', deepLinkURL);
//           return deepLinkURL;
//         }
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error getting initial URL:', error);
//       return null;
//     }
//   },
//   subscribe(listener) {
//     // Handle deep links when app is already open
//     const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
//       console.log('Deep link received while app open:', url);
//       listener(url);
//     });

//     // Handle notification clicks when app is in background
//     const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification opened with app in background:', remoteMessage);
//       const url = buildDeepLinkFromNotificationData(remoteMessage.data);
//       if (url) {
//         console.log('Created deep link from background notification:', url);
//         listener(url);
//       }
//     });

//     return () => {
//       linkingSubscription.remove();
//       unsubscribe();
//     };
//   },
// }

const Stack = createNativeStackNavigator();

/**
 * Auth Stack - Screens for unauthenticated users
 */
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main App Stack - Screens for authenticated users
 */
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Shops" component={ShopsScreen} />
      <Stack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="WishList" component={WishListScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      {/* Auth screen removed from MainStack as it should only be in AuthStack */}
    </Stack.Navigator>
  );
};

/**
 * Root navigator component for the app
 * @returns {React.ReactElement} Navigator component
 */
const RootNavigator = () => {
  const { isLoading, isAuthenticated, user, token } = useAuth();

  // Add an effect to monitor authentication state changes
  useEffect(() => {
    console.log('===== Authentication State in RootNavigator =====');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isLoading:', isLoading);
    console.log('User exists:', !!user);
    console.log('Token exists:', !!token);
    console.log('=================================================');
  }, [isAuthenticated, isLoading, user, token]);

  // Set up notification listeners
  // useEffect(() => {
    // Request notification permissions
    // const requestPermissions = async () => {
    //   try {
    //     const authStatus = await messaging().requestPermission();
    //     const enabled = 
    //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
    //     if (enabled) {
    //       console.log('Notification permissions granted');
    //       // Get FCM token
    //       const token = await messaging().getToken();
    //       console.log('FCM Token:', token);
    //       // Here you would typically send this token to your backend
    //     } else {
    //       console.log('Notification permissions denied');
    //     }
    //   } catch (error) {
    //     console.error('Error requesting notification permissions:', error);
    //   }
    // };

    // requestPermissions();

    // Handle foreground notifications
  //   const unsubscribe` = messaging().onMessage(async remoteMessage => {
  //     console.log('Notification received in foreground:', remoteMessage);
  //     // You can show a custom notification here using a library like react-native-push-notification
  //   });

  //   return unsubscribe;
  // }, []);

  if (isLoading) {
    // Show loading screen while checking authentication status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2d7c31ff" />
      </View>
    );
  }

  // Debug the authentication state
  console.log('RootNavigator render - isAuthenticated:', isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;


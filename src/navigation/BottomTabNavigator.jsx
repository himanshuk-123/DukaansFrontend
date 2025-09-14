import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure you have this package installed
import LocalMarketScreen from '../screens/LocalMarketScreen';
import ProfileScreen from '../screens/ProfileScreen';
import home from '../../assets/images/home.png';
import profile from '../../assets/images/profile.png';
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator Component
 * Provides navigation between main app screens like Home and Profile
 */
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32', // Green color for active tab
        tabBarInactiveTintColor: '#757575', // Gray color for inactive tab
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={LocalMarketScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image source={home} style={{ tintColor: color, width: size, height: size }} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Image source={profile} style={{ tintColor: color, width: size, height: size }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

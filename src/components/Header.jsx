import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

/**
 * Header component that shows app name and notification/cart icons
 * @param {Object} props - Component props
 * @param {string} [props.title="LocalMarket"] - Header title
 * @param {boolean} [props.showBack=false] - Whether to show back button
 * @param {Function} [props.onBackPress] - Function to call when back button is pressed
 * @param {boolean} [props.showCart=true] - Whether to show cart icon
 * @param {boolean} [props.showNotification=true] - Whether to show notification icon
 * @param {number} [props.notificationCount=0] - Number of notifications
 */
const Header = ({ 
  title = "LocalMarket", 
  showBack = false,
  onBackPress,
  showCart = true,
  showNotification = true,
  notificationCount = 0
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const badgeScaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const prevCartCountRef = useRef(0);
  
  // Update cart count whenever cartItems changes
  useEffect(() => {
    if (cartItems) {
      // Calculate total number of items (sum of quantities)
      const itemCount = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
      
      // Animate badge if count has changed
      if (itemCount !== prevCartCountRef.current) {
        animateBadge();
        prevCartCountRef.current = itemCount;
      }
      
      setCartCount(itemCount);
    } else {
      setCartCount(0);
    }
  }, [cartItems]);
  
  // Animation for the badge when cart count changes
  const animateBadge = () => {
    Animated.sequence([
      Animated.timing(badgeScaleAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(badgeScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleCartPress = () => {
    navigation.navigate('CartScreen');
  };

  const handleNotificationPress = () => {
    // Navigate to notifications screen (if implemented)
    // navigation.navigate('NotificationsScreen');
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : null}
        
        <Text style={styles.appName}>{title}</Text>
        
        <View style={styles.headerIcons}>
          {showNotification && (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPressIn={handlePressIn}
                onPressOut={() => {
                  handlePressOut();
                  handleNotificationPress();
                }}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../../assets/images/notification.jpg')} 
                  style={styles.icon} 
                />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {showCart && (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPressIn={handlePressIn}
                onPressOut={() => {
                  handlePressOut();
                  handleCartPress();
                }}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../../assets/images/cart.png')} 
                  style={styles.icon} 
                />
                {cartCount > 0 && (
                  <Animated.View 
                    style={[
                      styles.cartBadge,
                      { transform: [{ scale: badgeScaleAnim }] }
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? '99+' : cartCount > 9 ? '9+' : cartCount}
                    </Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#10B981',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#10B981',
    textShadowColor: 'rgba(16, 185, 129, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
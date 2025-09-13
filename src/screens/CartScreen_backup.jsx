import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Animated,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { 
    cartItems, 
    subtotal, 
    discount, 
    deliveryFee, 
    total, 
    couponApplied, 
    isLoading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    applyCoupon,
    clearCart
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const quantityAnim = useRef(new Animated.Value(1)).current;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
    }
  }, [isAuthenticated]);

  // Animation for quantity changes
  const animateQuantity = () => {
    Animated.sequence([
      Animated.timing(quantityAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(quantityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Handle quantity increase with animation
  const handleIncreaseQuantity = (id) => {
    increaseQuantity(id);
    animateQuantity();
  };

  // Handle quantity decrease with animation
  const handleDecreaseQuantity = (id) => {
    decreaseQuantity(id);
    animateQuantity();
  };

  // Handle item removal with confirmation
  const handleRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => removeFromCart(id)
        }
      ]
    );
  };

  // Handle cart clearing with confirmation
  const handleClearCart = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Your cart is already empty.");
      return;
    }
    
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Cart", 
          style: "destructive",
          onPress: () => clearCart()
        }
      ]
    );
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (couponCode.trim() === '') return;
    
    // Simple validation - in real app, this would validate against backend
    if (couponCode.toUpperCase() === 'SAVE10') {
      applyCoupon(true);
      Alert.alert("Success", "Coupon applied successfully!");
    } else {
      Alert.alert("Invalid Coupon", "The coupon code you entered is invalid.");
    }
    setCouponCode('');
  };

  // Render a single cart item
  const renderCartItem = (item) => {
    // Get product ID from either id or product_id
    const itemId = item.id || item.product_id;
    // Use product_name from API or fallback to name
    const name = item.product_name || item.name;
    // Get image from different possible sources
    const imageUrl = item.primary_image_url || item.image || 'https://via.placeholder.com/150';
    // Calculate price - account for different API formats
    const price = typeof item.unit_price !== 'undefined' ? item.unit_price : item.price;
    // Get description - could be unit_name or description
    const description = item.unit_name ? `${item.quantity} ${item.unit_name}` : (item.description || '');
    
    return (
      <View key={itemId} style={styles.cartItem}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.itemImage} 
          defaultSource={require('../../assets/images/placeholder.png')}
        />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{name}</Text>
          <Text style={styles.itemDescription}>{description}</Text>
          <Text style={styles.itemPrice}>₹{(price * item.quantity).toFixed(2)}</Text>
        </View>
        
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            onPress={() => handleDecreaseQuantity(itemId)} 
            style={styles.quantityButton}
            disabled={isLoading}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Animated.Text style={[styles.quantity, { transform: [{ scale: quantityAnim }] }]}>
            {item.quantity}
          </Animated.Text>
          
          <TouchableOpacity 
            onPress={() => handleIncreaseQuantity(itemId)} 
            style={styles.quantityButton}
            disabled={isLoading}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleRemoveItem(itemId)}
          style={styles.removeButton}
          disabled={isLoading}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.headerButton} disabled={isLoading}>
          <Text style={[styles.headerButtonText, isLoading && styles.disabledText]}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Updating cart...</Text>
        </View>
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLogin={() => {
          setLoginModalVisible(false);
          navigation.navigate('Auth', { screen: 'Login' });
        }}
        onSignup={() => {
          setLoginModalVisible(false);
          navigation.navigate('Auth', { screen: 'Register' });
        }}
      />

      {/* Empty Cart State */}
      {!isLoading && (!cartItems || cartItems.length === 0) ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty!</Text>
          <Text style={styles.emptySubtitle}>Add products to get started.</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('LocalMarket')}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Cart Items */}
          <View style={styles.itemsContainer}>
            {cartItems.map(item => renderCartItem(item))}
          </View>

          {/* Coupon Section */}
          <View style={styles.couponContainer}>
            {couponApplied ? (
              <View style={styles.couponApplied}>
                <Text style={styles.couponAppliedText}>10% Off Applied ✓</Text>
              </View>
            ) : (
              <View style={styles.couponInputContainer}>
                <TextInput
                  placeholder="Enter Coupon Code (try SAVE10)"
                  placeholderTextColor="#9E9E9E"
                  style={styles.couponInput}
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={handleApplyCoupon}
                  disabled={isLoading || !couponCode.trim()}
                >
                  <Text style={[
                    styles.applyButtonText, 
                    (!couponCode.trim() || isLoading) && styles.disabledText
                  ]}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Price Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Price Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>
                {discount > 0 ? `-₹${discount.toFixed(2)}` : '₹0.00'}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Bottom Checkout Bar - Only show if we have items */}
      {!isLoading && cartItems && cartItems.length > 0 && (
        <View style={styles.checkoutBar}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutTotal}>₹{total.toFixed(2)}</Text>
            <Text style={styles.checkoutSubtext}>incl. all charges</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#333333',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#F44336',
    fontWeight: 'bold',
  },
  couponContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  couponInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  couponInput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#F5F5F5',
  },
  applyButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  couponApplied: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  couponAppliedText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
  },
  discountText: {
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  checkoutSubtext: {
    fontSize: 12,
    color: '#777777',
  },
  checkoutButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: '65%',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E7D32',
  },
  disabledText: {
    opacity: 0.5,
  },
  quantityTextContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  }
});
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
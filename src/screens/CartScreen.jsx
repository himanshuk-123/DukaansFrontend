import React, { useState, useRef } from 'react';
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
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Organic Apples',
      description: '1kg pack',
      price: 120,
      quantity: 2,
      image: 'https://cdn.pixabay.com/photo/2017/09/26/13/42/apple-2788662_1280.jpg'
    },
    {
      id: 2,
      name: 'Fresh Milk',
      description: 'Amul, 1L',
      price: 65,
      quantity: 1,
      image: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg'
    },
    {
      id: 3,
      name: 'Potatoes',
      description: '1kg pack',
      price: 30,
      quantity: 1,
      image: 'https://cdn.pixabay.com/photo/2016/08/11/08/49/potatoes-1585075_1280.jpg'
    }
  ]);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const quantityAnim = useRef(new Animated.Value(1)).current;

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 0 ? 20 : 0;
  const total = subtotal - discount + deliveryFee;

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

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: item.quantity + 1} : item
    ));
    animateQuantity();
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 
        ? {...item, quantity: item.quantity - 1} 
        : item
    ));
    animateQuantity();
  };

  const removeItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => setCartItems(cartItems.filter(item => item.id !== id))
        }
      ]
    );
  };

  const clearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Cart", 
          style: "destructive",
          onPress: () => setCartItems([])
        }
      ]
    );
  };

  const applyCoupon = () => {
    if (couponCode.trim() === '') return;
    setCouponApplied(true);
    setCouponCode('');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>
      
      <View style={styles.quantitySelector}>
        <TouchableOpacity 
          onPress={() => decreaseQuantity(item.id)} 
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Animated.Text style={[styles.quantity, { transform: [{ scale: quantityAnim }] }]}>
          {item.quantity}
        </Animated.Text>
        
        <TouchableOpacity 
          onPress={() => increaseQuantity(item.id)} 
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={() => removeItem(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity style={styles.headerButton} disabled>
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty!</Text>
          <Text style={styles.emptySubtitle}>Add products to get started.</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.browseButtonText}>Browse Shops</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={clearCart} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
              
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  onPress={() => decreaseQuantity(item.id)} 
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <Animated.Text style={[styles.quantity, { transform: [{ scale: quantityAnim }] }]}>
                  {item.quantity}
                </Animated.Text>
                
                <TouchableOpacity 
                  onPress={() => increaseQuantity(item.id)} 
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
                placeholder="Enter Coupon Code"
                placeholderTextColor="#9E9E9E"
                style={styles.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity style={styles.applyButton} onPress={applyCoupon}>
                <Text style={styles.applyButtonText}>Apply</Text>
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
            <Text style={[styles.summaryValue, styles.discountText]}>-₹{discount.toFixed(2)}</Text>
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

      {/* Bottom Checkout Bar */}
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
    </SafeAreaView>
  );
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
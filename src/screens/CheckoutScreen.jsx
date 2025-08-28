import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  SafeAreaView,
  Dimensions,
  Modal,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    orderSummary: true,
    deliveryAddress: true,
    paymentMethod: true,
    promoCode: false
  });
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const sectionHeights = useRef({
    orderSummary: new Animated.Value(0),
    deliveryAddress: new Animated.Value(0),
    paymentMethod: new Animated.Value(0),
    promoCode: new Animated.Value(0)
  }).current;

  // Sample data
  const orderItems = [
    { id: 1, name: 'Organic Apples', price: 120, quantity: 2, image: 'https://cdn.pixabay.com/photo/2017/09/26/13/42/apple-2788662_1280.jpg' },
    { id: 2, name: 'Fresh Milk', price: 65, quantity: 1, image: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg' }
  ];

  const addresses = [
    { id: 1, type: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', isDefault: true },
    { id: 2, type: 'Work', address: '456 Office Park, Floor 3, New York, NY 10002', isDefault: false }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '📱' },
    { id: 'cash', name: 'Cash on Delivery', icon: '💵' }
  ];

  // Calculate order total
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 20;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount + deliveryFee;

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });

    // Animate section height
    Animated.timing(sectionHeights[section], {
      toValue: expandedSections[section] ? 0 : 1,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  // Handle place order button animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const handlePlaceOrder = () => {
    // Button animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();

    // Show success modal after a short delay
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  const applyPromoCode = () => {
    if (promoCode.trim() !== '') {
      setPromoApplied(true);
    }
  };

  const OrderSummarySection = () => {
    const heightAnim = sectionHeights.orderSummary.interpolate({
      inputRange: [0, 1],
      outputRange: [0, orderItems.length * 80 + 180]
    });

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('orderSummary')}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.sectionToggle}>{expandedSections.orderSummary ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        <Animated.View style={[styles.sectionContent, { height: heightAnim }]}>
          {orderItems.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price} x {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          {promoApplied && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount (10%)</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  const DeliveryAddressSection = () => {
    const heightAnim = sectionHeights.deliveryAddress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, addresses.length * 100 + 60]
    });

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('deliveryAddress')}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.sectionToggle}>{expandedSections.deliveryAddress ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        <Animated.View style={[styles.sectionContent, { height: heightAnim }]}>
          {addresses.map(address => (
            <TouchableOpacity key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressType}>{address.type}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{address.address}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addAddressButton}>
            <Text style={styles.addAddressText}>+ Add New Address</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const PaymentMethodSection = () => {
    const heightAnim = sectionHeights.paymentMethod.interpolate({
      inputRange: [0, 1],
      outputRange: [0, paymentMethods.length * 70 + 20]
    });

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('paymentMethod')}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.sectionToggle}>{expandedSections.paymentMethod ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        <Animated.View style={[styles.sectionContent, { height: heightAnim }]}>
          {paymentMethods.map(method => (
            <TouchableOpacity 
              key={method.id} 
              style={[
                styles.paymentMethod, 
                selectedPayment === method.id && styles.selectedPayment
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={styles.paymentName}>{method.name}</Text>
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.radioButtonSelected
              ]}>
                {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    );
  };

  const PromoCodeSection = () => {
    const heightAnim = sectionHeights.promoCode.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 80]
    });

    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('promoCode')}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <Text style={styles.sectionToggle}>{expandedSections.promoCode ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        
        <Animated.View style={[styles.sectionContent, { height: heightAnim }]}>
          {promoApplied ? (
            <View style={styles.promoApplied}>
              <Text style={styles.promoAppliedText}>Promo code applied! 10% discount</Text>
              <TouchableOpacity onPress={() => setPromoApplied(false)}>
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputContainer}>
              <TextInput
                placeholder="Enter promo code"
                style={styles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const SuccessModal = () => (
    <Modal visible={showSuccess} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>Your order has been confirmed and will be delivered soon.</Text>
          
          <View style={styles.successDetails}>
            <Text style={styles.successDetail}>Order #: 123456</Text>
            <Text style={styles.successDetail}>Estimated Delivery: 30-45 min</Text>
            <Text style={styles.successDetail}>Total: ₹{total.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => {
              setShowSuccess(false);
              navigation.navigate('LocalMarket');
            }}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <OrderSummarySection />
        <DeliveryAddressSection />
        <PaymentMethodSection />
        <PromoCodeSection />
      </ScrollView>

      {/* Fixed Place Order Button */}
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePlaceOrder}
            activeOpacity={0.9}
          >
            <Text style={styles.placeOrderText}>Place Order - ₹{total.toFixed(2)}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <SuccessModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1E3A8A',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sectionToggle: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionContent: {
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#64748B',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1E293B',
  },
  discountText: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addressCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  editButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  addAddressButton: {
    padding: 16,
    alignItems: 'center',
  },
  addAddressText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedPayment: {
    backgroundColor: '#F0F9FF',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentName: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  promoInputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  promoApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ECFDF5',
  },
  promoAppliedText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '500',
  },
  removePromoText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placeOrderButton: {
    backgroundColor: '#1E3A8A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  successDetail: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  continueShoppingButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
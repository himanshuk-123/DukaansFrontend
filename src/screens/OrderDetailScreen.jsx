import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useOrder } from '../context/OrderContext';

const { width } = Dimensions.get('window');

/**
 * Order detail screen to display full information about a specific order
 * @param {Object} props - Component props
 * @param {Object} props.route - Route object containing params
 * @param {Object} props.navigation - Navigation object
 * @returns {React.ReactElement} OrderDetailScreen component
 */
const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { getOrderById, cancelOrder, reorder, isLoading, error } = useOrder();
  const [order, setOrder] = useState(null);

  // Fetch order details when screen loads
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderById(orderId);
      if (response.success) {
        setOrder(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to fetch order details. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              const result = await cancelOrder(orderId);
              if (result.success) {
                Alert.alert("Success", "Order cancelled successfully");
                // Refresh order details to show updated status
                fetchOrderDetails();
              } else {
                Alert.alert("Error", result.message || "Failed to cancel order");
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert("Error", "Failed to cancel order. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleReorder = async () => {
    Alert.alert(
      "Reorder",
      "Would you like to place the same order again?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              const result = await reorder(orderId);
              if (result.success) {
                Alert.alert(
                  "Success", 
                  "Your order has been placed successfully!", 
                  [
                    { 
                      text: "View Order", 
                      onPress: () => navigation.navigate('OrderDetail', { orderId: result.data.id }) 
                    },
                    { text: "OK" }
                  ]
                );
              } else {
                Alert.alert("Error", result.message || "Failed to place order");
              }
            } catch (error) {
              console.error('Error reordering:', error);
              Alert.alert("Error", "Failed to place order. Please try again.");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': 
      case 'Completed': 
        return '#2E7D32';
      case 'Pending': 
      case 'Processing': 
        return '#FF9800';
      case 'Cancelled': 
        return '#F44336';
      default: 
        return '#616161';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': 
      case 'Completed': 
        return '✅';
      case 'Pending': 
      case 'Processing': 
        return '🕒';
      case 'Cancelled': 
        return '❌';
      default: 
        return '📦';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Order Not Found</Text>
        <Text style={styles.errorText}>
          The order you're looking for couldn't be found.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.id}</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusIcon(order.status)} {order.status}
              </Text>
            </View>
            <Text style={styles.orderDate}>Placed on {formatDate(order.created_at)}</Text>
          </View>
        </View>

        {/* Shop Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop</Text>
          <View style={styles.shopCard}>
            <View style={styles.shopIcon}>
              <Text style={styles.shopIconText}>🏪</Text>
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{order.shop_name || 'Shop'}</Text>
              <Text style={styles.shopAddress}>Address not available</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items && order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image 
                source={{ uri: item.product_image || 'https://via.placeholder.com/60' }} 
                style={styles.itemImage}
                defaultSource={require('../../assets/images/grocery.jpg')}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product_name || 'Product'}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{parseFloat(item.total_price || 0).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>{order.delivery_address || 'Address not provided'}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Text style={styles.paymentValue}>{order.payment_method || 'COD'}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tax</Text>
              <Text style={styles.paymentValue}>₹{parseFloat(order.tax || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{parseFloat(order.total_amount || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {order.shipping_status === 'pending' && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelOrder}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          {order.shipping_status === 'delivered' && (
            <TouchableOpacity 
              style={styles.reorderButton}
              onPress={handleReorder}
            >
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => {/* Navigate to support */}}
          >
            <Text style={styles.supportButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    color: '#616161',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2E7D32',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
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
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    color: '#616161',
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shopIconText: {
    fontSize: 20,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 12,
    color: '#616161',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#616161',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  addressCard: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#616161',
  },
  paymentValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  notesCard: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  actionContainer: {
    padding: 16,
    marginBottom: 24,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reorderButton: {
    backgroundColor: '#FF9800',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  supportButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616161',
  },
});

export default OrderDetailScreen;

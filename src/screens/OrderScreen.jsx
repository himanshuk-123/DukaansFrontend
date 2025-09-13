import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import OrderService from '../services/OrderService'
import { useOrder } from '../context/OrderContext';
const { width } = Dimensions.get('window');

const OrderScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [orders, setOrders] = useState([]);
  const { setGlobalOrders } = useOrder();
  // Sample order data

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getUserOrders();
      setOrders(response.data.data);
      setGlobalOrders(response.data.data);
      console.log("Response: ", response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
     
  useState(() => {
    fetchOrders();
  }, []);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#2E7D32';
      case 'Pending': return '#FF9800';
      case 'Cancelled': return '#F44336';
      default: return '#616161';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✅';
      case 'Pending': return '🕒';
      case 'Cancelled': return '❌';
      default: return '📦';
    }
  };

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (activeFilter === 'ongoing') return order.status === 'Pending';
        if (activeFilter === 'completed') return order.status === 'Delivered';
        if (activeFilter === 'cancelled') return order.status === 'Cancelled';
        return true;
      });

  const renderOrderItem = ({ item }) => (
    <Animated.View 
      style={[styles.orderCard, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.orderHeader}>
        <View style={styles.shopInfo}>
          <View style={styles.shopIcon}>
            <Text style={styles.shopIconText}>🛒</Text>
          </View>
          <Text style={styles.shopName}>{item.shop_name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.shipping_status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.shipping_status) }]}>
            {getStatusIcon(item.shipping_status)} {item.shipping_status}
          </Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <View style={styles.productImages}>
          {item.items.slice(0, 3).map((product, index) => (
            <Image 
              key={index} 
              source={{ uri: product.product_image }} 
              style={[
                styles.productImage, 
                { zIndex: 3 - index, marginLeft: index > 0 ? -15 : 0 }
              ]} 
            />
          ))}
          {item.items.length > 3 && (
            <View style={[styles.moreItems, { marginLeft: -15 }]}>
              <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderDetails}>
          <Text style={styles.orderDate}>{item.order_date}</Text>
          <Text style={styles.orderTotal}>{item.total_amount}</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        
        {item.status === 'Delivered' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.reorderButton]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          // keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'all' 
              ? "You haven't placed any orders yet" 
              : `You don't have any ${activeFilter} orders`}
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shopIconText: {
    fontSize: 20,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImages: {
    flexDirection: 'row',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreItems: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#616161',
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderDate: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  reorderButton: {
    backgroundColor: '#FF9800',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    color: '#BDBDBD',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 24,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
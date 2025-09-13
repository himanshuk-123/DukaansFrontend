import api, { isRateLimited } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Order cache keys
const ORDER_CACHE_KEY = 'order_cache';
const ORDER_CACHE_TIMESTAMP_KEY = 'order_cache_timestamp';
const ORDER_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Service for order-related API calls
 */
class OrderService {
  /**
   * Create a new order from cart items
   * @param {Object} orderData - Order details
   * @param {string} orderData.delivery_address - Delivery address for the order
   * @param {string} [orderData.payment_method] - Payment method (COD, Card, etc.)
   * @param {string} [orderData.notes] - Any special instructions
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      // Log detailed error information
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        if (error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order. Please try again.',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Get a specific order by ID
   * @param {number} orderId - ID of the order to fetch
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order. Please try again.'
      };
    }
  }

  /**
   * Get all orders for the current user
   * @param {Object} [queryParams] - Optional query parameters
   * @param {number} [queryParams.page] - Page number for pagination
   * @param {number} [queryParams.limit] - Number of results per page
   * @param {string} [queryParams.status] - Filter by order status
   * @param {boolean} [forceRefresh] - Whether to bypass cache and force a new API call
   * @returns {Promise<Object>} Orders and pagination info
   */
  async getUserOrders(queryParams = {}) {
    try {
      console.log('Fetching fresh orders from API');
      const response = await api.get('/orders', { params: queryParams });      
      return response;
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  }

  /**
   * Cancel an order
   * @param {number} orderId - ID of the order to cancel
   * @returns {Promise<Object>} Cancelled order details
   */
  async cancelOrder(orderId) {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order. Please try again.'
      };
    }
  }

  /**
   * Reorder a previous order
   * @param {number} orderId - ID of the order to reorder
   * @returns {Promise<Object>} New order details
   */
  async reorder(orderId) {
    try {
      const response = await api.post(`/orders/reorder/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error reordering order ${orderId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to place reorder. Please try again.'
      };
    }
  }
  /**
   * Cache orders data
   * @private
   * @param {Array} orders - Orders data to cache
   * @param {Object} queryParams - Query parameters used to fetch the orders
   */
  async cacheOrders(orders, queryParams = {}) {
    try {
      const cacheKey = `${ORDER_CACHE_KEY}_${JSON.stringify(queryParams)}`;
      const now = Date.now();
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(orders));
      await AsyncStorage.setItem(`${cacheKey}_timestamp`, now.toString());
      
      console.log(`Cached ${orders.length} orders at ${new Date(now).toLocaleTimeString()}`);
    } catch (error) {
      console.warn('Failed to cache orders:', error);
    }
  }
  
  /**
   * Get cached orders data if it's still valid
   * @private
   * @param {Object} queryParams - Query parameters to match the cache
   * @returns {Array|null} Cached orders or null if no valid cache exists
   */
  async getCachedOrders(queryParams = {}) {
    try {
      const cacheKey = `${ORDER_CACHE_KEY}_${JSON.stringify(queryParams)}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      const timestampStr = await AsyncStorage.getItem(`${cacheKey}_timestamp`);
      
      if (!cachedData || !timestampStr) {
        return null;
      }
      
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp > ORDER_CACHE_TTL) {
        console.log('Orders cache expired, needs refresh');
        return null;
      }
      
      const orders = JSON.parse(cachedData);
      console.log(`Using cached ${orders.length} orders from ${new Date(timestamp).toLocaleTimeString()}`);
      return orders;
    } catch (error) {
      console.warn('Failed to retrieve cached orders:', error);
      return null;
    }
  }
}

export default new OrderService();

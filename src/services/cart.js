import { api } from './api';

/**
 * Cart service for interacting with cart API endpoints
 */
const CartService = {
  /**
   * Get the current user's cart
   * @returns {Promise<Object>} - Response containing the user's cart data
   */
  getUserCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to retrieve cart.',
        data: null
      };
    }
  },

  /**
   * Add an item to the cart
   * @param {Object} item - Item data to add to cart
   * @returns {Promise<Object>} - Response containing the updated cart
   */
  addToCart: async (item) => {
    try {
      console.log('Cart service: Adding item to cart:', item);
      
      // Ensure product_id is a number
      const payload = {
        product_id: parseInt(item.product_id, 10),
        quantity: parseInt(item.quantity, 10)
      };
      
      if (isNaN(payload.product_id)) {
        throw new Error(`Invalid product_id: ${item.product_id}`);
      }
      
      if (isNaN(payload.quantity) || payload.quantity <= 0) {
        payload.quantity = 1; // Default to 1 if invalid
      }
      
      console.log('Cart service: Sending payload:', payload);
      const response = await api.post('/cart/items', payload);
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart.',
        data: null
      };
    }
  },

  /**
   * Update the quantity of an item in the cart
   * @param {number} productId - ID of the product to update
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} - Response containing the updated cart
   */
  updateCartItem: async (productId, quantity) => {
    try {
      console.log('Cart service: Updating item quantity:', { productId, quantity });
      
      // Ensure productId and quantity are valid numbers
      const parsedProductId = parseInt(productId, 10);
      const parsedQuantity = parseInt(quantity, 10);
      
      if (isNaN(parsedProductId)) {
        throw new Error(`Invalid product_id: ${productId}`);
      }
      
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
      }
      
      const payload = {
        product_id: parsedProductId,
        quantity: parsedQuantity
      };
      
      console.log('Cart service: Sending update payload:', payload);
      const response = await api.put('/cart/items', payload);
      return response.data;
    } catch (error) {
      console.error('Update cart error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart item.',
        data: null
      };
    }
  },

  /**
   * Remove an item from the cart
   * @param {number} productId - ID of the product to remove
   * @returns {Promise<Object>} - Response containing the updated cart
   */
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item from cart.',
        data: null
      };
    }
  },

  /**
   * Clear the cart
   * @returns {Promise<Object>} - Response indicating success or failure
   */
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Clear cart error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart.',
        data: null
      };
    }
  }
};

export default CartService;

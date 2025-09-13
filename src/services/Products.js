import api from './api'

/**
 * Service for interacting with product-related API endpoints
 */
const products = {
  /**
   * Get all products from a specific shop
   * @param {number} id - The ID of the shop
   * @returns {Promise} - Promise with the API response
   */
  getAllShopProduct: async (id) => {
    const response = await api.get(`/products/shop/${id}`);
    return response.data;
  },

  /**
   * Get details of a specific product
   * @param {number} productId - The ID of the product
   * @returns {Promise} - Promise with the API response
   */
  getProductDetail: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Search products by query string
   * @param {string} query - The search query
   * @returns {Promise} - Promise with the API response
   */
  searchProducts: async (query) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  /**
   * Get products by category
   * @param {number} categoryId - The ID of the category
   * @returns {Promise} - Promise with the API response
   */
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  getTop5Products: async (shopId) => {
    try {
      const response = await api.get(`/products/top/${shopId}`);
      console.log('Top products API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  }
}

export default products;
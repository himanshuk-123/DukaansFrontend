import React, { createContext, useState, useContext, useEffect } from 'react';
import CartService from '../services/cart';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

// Initialize the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart Provider component
export const CartProvider = ({ children }) => {
  const { isAuthenticated, user, requireAuth } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(20); // Default delivery fee
  const [total, setTotal] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastNavigationState, setLastNavigationState] = useState(null);

  // Load cart when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [isAuthenticated]);

  // Calculate cart totals whenever cartItems change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newDiscount = couponApplied ? newSubtotal * 0.1 : 0;
    const newDeliveryFee = newSubtotal > 0 ? deliveryFee : 0;
    const newTotal = newSubtotal - newDiscount + newDeliveryFee;
    
    setSubtotal(newSubtotal);
    setDiscount(newDiscount);
    setTotal(newTotal);
  }, [cartItems, couponApplied, deliveryFee]);

  // Fetch the user's cart from the API
  const fetchUserCart = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await CartService.getUserCart();
      if (response.success && response.data) {
        setCartItems(response.data.items || []);
      } else {
        console.error('Failed to fetch cart:', response.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the last navigation state before redirecting to login
  const saveNavigationState = (state) => {
    setLastNavigationState(state);
  };

  // Get the last navigation state
  const getLastNavigationState = () => {
    return lastNavigationState;
  };

  // Clear the last navigation state
  const clearNavigationState = () => {
    setLastNavigationState(null);
  };

  // Add item to cart - updated to use the requireAuth function
  const addToCart = async (item, navigationParams) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Add to Cart',
      message: 'Create an account or sign in to add items to your cart.',
      returnTo: navigationParams?.routeName,
      returnParams: navigationParams?.params
    });
    
    if (!isAuthed) {
      return { requiresAuth: true };
    }
    
    setIsLoading(true);
    try {
      // Ensure product_id is a valid number
      let productIdToUse;
      
      if (item.product_id) {
        productIdToUse = parseInt(item.product_id, 10);
      } else if (item.id) {
        productIdToUse = parseInt(item.id, 10);
      } else {
        throw new Error('No valid product ID provided');
      }
      
      if (isNaN(productIdToUse)) {
        throw new Error('Invalid product ID: ' + JSON.stringify({
          original_product_id: item.product_id,
          original_id: item.id
        }));
      }
      
      console.log('CartContext: Adding to cart with product_id:', productIdToUse);
      
      const response = await CartService.addToCart({
        product_id: productIdToUse,
        quantity: parseInt(item.quantity || 1, 10)
      });
      
      if (response.success && response.data) {
        // Update local cart with API response
        setCartItems(response.data.items || []);
        return { success: true };
      } else {
        Alert.alert('Error', response.message || 'Failed to add item to cart');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart - updated to use requireAuth
  const removeFromCart = async (itemId) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Manage Cart',
      message: 'You need to be signed in to manage your cart.'
    });
    
    if (!isAuthed) return;
    
    setIsLoading(true);
    try {
      const response = await CartService.removeFromCart(itemId);
      
      if (response.success && response.data) {
        // Update local cart with API response
        setCartItems(response.data.items || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity - updated to use requireAuth
  const updateQuantity = async (itemId, newQuantity) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Update Cart',
      message: 'You need to be signed in to update your cart.'
    });
    
    if (!isAuthed) return { requiresAuth: true };
    
    if (newQuantity < 1) {
      console.log('Invalid quantity. Must be at least 1.');
      return { success: false, message: 'Quantity must be at least 1' };
    }
    
    setIsLoading(true);
    try {
      // Ensure itemId is a valid number
      const parsedItemId = parseInt(itemId, 10);
      if (isNaN(parsedItemId)) {
        throw new Error(`Invalid item ID: ${itemId}`);
      }
      
      console.log('Updating cart item quantity:', { itemId: parsedItemId, newQuantity });
      
      const response = await CartService.updateCartItem(parsedItemId, newQuantity);
      
      if (response.success && response.data) {
        // Update local cart with API response
        setCartItems(response.data.items || []);
        return { success: true };
      } else {
        Alert.alert('Error', response.message || 'Failed to update item quantity');
        return { success: false, message: response.message || 'Failed to update item quantity' };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update item quantity');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Increase quantity by 1 - updated to use requireAuth
  const increaseQuantity = async (itemId) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Update Cart',
      message: 'You need to be signed in to update your cart.'
    });
    
    if (!isAuthed) return;
    
    const item = cartItems.find(item => (item.id === itemId || item.product_id === itemId));
    if (item) {
      await updateQuantity(itemId, item.quantity + 1);
    }
  };

  // Decrease quantity by 1 - updated to use requireAuth
  const decreaseQuantity = async (itemId) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Update Cart',
      message: 'You need to be signed in to update your cart.'
    });
    
    if (!isAuthed) return;
    
    const item = cartItems.find(item => (item.id === itemId || item.product_id === itemId));
    if (item && item.quantity > 1) {
      await updateQuantity(itemId, item.quantity - 1);
    }
  };

  // Clear the cart - updated to use requireAuth
  const clearCart = async () => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Clear Cart',
      message: 'You need to be signed in to clear your cart.'
    });
    
    if (!isAuthed) return;
    
    setIsLoading(true);
    try {
      const response = await CartService.clearCart();
      
      if (response.success) {
        setCartItems([]);
        setCouponApplied(false);
      } else {
        Alert.alert('Error', response.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply a coupon
  const applyCoupon = (valid) => {
    setCouponApplied(valid);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        discount,
        deliveryFee,
        total,
        couponApplied,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        applyCoupon,
        saveNavigationState,
        getLastNavigationState,
        clearNavigationState
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

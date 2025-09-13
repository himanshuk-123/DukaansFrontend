import { useState, useEffect } from 'react';

/**
 * Custom hook for managing shopping cart
 * @returns {Object} Cart methods and state
 */
const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(20); // Default delivery fee
  const [total, setTotal] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

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

  /**
   * Add item to cart
   * @param {Object} item - Item to add
   */
  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Item exists, increment quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Item doesn't exist, add new item with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  /**
   * Remove item from cart
   * @param {string|number} itemId - Item ID to remove
   */
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  /**
   * Update item quantity
   * @param {string|number} itemId - Item ID to update
   * @param {number} newQuantity - New quantity
   */
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  /**
   * Increase quantity by 1
   * @param {string|number} itemId - Item ID
   */
  const increaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  /**
   * Decrease quantity by 1
   * @param {string|number} itemId - Item ID
   */
  const decreaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ));
  };

  /**
   * Clear the cart
   */
  const clearCart = () => {
    setCartItems([]);
    setCouponApplied(false);
  };

  /**
   * Apply a coupon
   * @param {boolean} valid - Whether coupon is valid
   */
  const applyCoupon = (valid) => {
    setCouponApplied(valid);
  };

  return {
    cartItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    couponApplied,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    applyCoupon,
  };
};

export default useCart;

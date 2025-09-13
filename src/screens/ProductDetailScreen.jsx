import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import productService from '../services/Products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginPromptModal from '../components/LoginPromptModal';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart(); 
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  
  const { productId } = route.params || {};

  // Sample reviews data - this would ideally come from an API as well
  const reviews = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      rating: 5,
      comment: 'Very fresh and sweet products. Will definitely buy again!',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Anita Sharma',
      rating: 4,
      comment: 'Good quality, but some were smaller than expected.',
      avatar: '👤'
    }
  ];

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      console.log('Fetching product details for ID:', productId);
      fetchProductDetail();
    } else {
      console.error('No product ID provided in route params');
      setError("Product ID is required");
      setLoading(false);
      // Optional: Navigate back after showing an alert
      Alert.alert(
        "Error",
        "Product information could not be found",
        [{ text: "Go Back", onPress: () => navigation.goBack() }]
      );
    }
  }, [productId]);

  const fetchProductDetail = async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Calling API for product ID:', productId);
      const response = await productService.getProductDetail(productId);
      console.log('Product details response:', response);
      
      if (response && response.data) {
        setProduct(response.data);
      } else {
        console.error('Empty or invalid response for product ID:', productId);
        setError("Product not found");
        Alert.alert(
          "Error",
          "Product information could not be loaded",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(error.message || "Failed to load product details");
      Alert.alert(
        "Error",
        "Failed to load product details: " + (error.message || "Unknown error"),
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Refs for animations
  const quantityScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Handle scroll for header visibility
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHeaderVisible(scrollY > 50);
  };

  // Quantity change animation
  const animateQuantity = () => {
    Animated.sequence([
      Animated.timing(quantityScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(quantityScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Add to cart animation
  const animateAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login modal
      setLoginModalVisible(true);
      return;
    }
    
    // If product exists, proceed with add to cart
    if (product) {
      try {
        // Determine the product ID, ensuring it's a number
        let productIdToUse = parseInt(productId, 10);;
        
        console.log('Adding to cart with product ID:', productIdToUse, 'quantity:', quantity);
        
        // First check if the item already exists in the cart
        const existingItem = cartItems.find(item => 
          (item.product_id === productIdToUse)
        );
        
        let result;
        
        if (existingItem) {
          console.log('Item already exists in cart, updating quantity:', existingItem);
          // If item exists, update its quantity - add the new quantity to the existing quantity
          const newTotalQuantity = quantity; // Use the selected quantity directly, not adding to existing
          
          // Make sure we don't exceed product stock if available
          const maxStock = product.stock || 999; // Default to a high number if stock not provided

          if (newTotalQuantity > maxStock) {
            Alert.alert(
              'Quantity Limit',
              `Sorry, only ${maxStock} items are available in stock.`,
              [{ text: 'OK' }]
            );
            return;
          }
          
          console.log(`Updating cart with quantity: ${newTotalQuantity}`);
          result = await updateQuantity(
            existingItem.product_id,
            newTotalQuantity
          );
        } else {
          // If item doesn't exist, add it as new
          // Check against stock if available
          const maxStock = product.stock || 999;
          
          if (quantity > maxStock) {
            Alert.alert(
              'Quantity Limit',
              `Sorry, only ${maxStock} items are available in stock.`,
              [{ text: 'OK' }]
            );
            return;
          }
          
          result = await addToCart(
            {
              product_id: productIdToUse,
              quantity: quantity,
              // Include these for display purposes in the cart UI
              name: product.name,
              price: product.price,
              image: product.primary_image_url || product.image
            }
          );
        }
        
        // If authentication is required, the modal will be shown by the CartContext
        // and this function will return
        if (result?.requiresAuth) {
          return;
        }
        
        if (result?.success) {
          setAddedToCart(true);
          
          Animated.sequence([
            Animated.timing(buttonScale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start();
          
          // Reset button text after delay
          setTimeout(() => {
            setAddedToCart(false);
          }, 2000);
        } else if (result?.message) {
          Alert.alert('Error', result.message);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        Alert.alert('Error', 'Failed to add item to cart');
      }
    }
  };

  const increaseQuantity = () => {
    // Check if we have stock quantity info and enforce the limit
    if (product && product.stock !== undefined) {
      if (quantity >= product.stock) {
        // Show a small alert if trying to exceed stock
        Alert.alert(
          'Maximum Quantity Reached',
          `Sorry, only ${product.stock} items are available in stock.`,
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    console.log("Quantity: ", quantity);
    setQuantity(quantity + 1);
    animateQuantity();
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      animateQuantity();
    }
  };

  const toggleFavorite = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login modal
      setLoginModalVisible(true);
      return;
    }
    // If user is authenticated, proceed with toggle favorite
    setIsFavorite(!isFavorite);
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  // Helper function to render action buttons with consistent handling of all states
  const renderActionButtons = () => {
    if (loading) {
      return (
        <View style={styles.actionBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.actionPrice}>Loading...</Text>
          </View>
          <View style={styles.addToCartButtonDisabled}>
            <Text style={styles.addToCartText}>Please Wait</Text>
          </View>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.actionBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.actionPrice}>--</Text>
          </View>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchProductDetail}
          >
            <Text style={styles.addToCartText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Check if product has stock
    const hasStock = product && product.stock > 0;

    return (
      <View style={styles.actionBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.actionPrice}>₹{product?.price || '--'}</Text>
          <Text style={styles.taxText}>incl. taxes</Text>
        </View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          {hasStock ? (
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={animateAddToCart}
              activeOpacity={0.9}
            >
              <Text style={styles.addToCartText}>
                {addedToCart ? 'Added ✓' : `Add ${quantity} ${quantity > 1 ? 'items' : 'item'} to Cart`}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.outOfStockButton}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const StarRating = ({ rating, size = 16 }) => {
    const fullStars = Math.floor(rating);
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text 
            key={i} 
            style={[
              styles.star, 
              { fontSize: size },
              i < fullStars ? styles.starFilled : styles.starEmpty
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProductDetail}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.retryButton, { marginTop: 10, backgroundColor: '#666666' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No product found
  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorMessage}>We couldn't find the product you're looking for.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Map product features from API data or use default features
  const productFeatures = product.features || [
    { icon: '🍃', text: '100% Fresh' },
    { icon: '🚚', text: 'Free Delivery' },
    { icon: '🌿', text: product.category_name || 'Quality Product' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.primary_image_url }} 
            style={styles.productImage}
          />
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{product.ProductName}</Text>
          <Text>{productId}</Text>
          <Text style={styles.productDescription}>{product.description || 'No description available'}</Text>
          
          <View style={styles.ratingContainer}>
            <StarRating rating={product.rating || 0} />
            <Text style={styles.reviewText}>({product.review_count || 0} reviews)</Text>
          </View>
          
          <View style={styles.divider} />
          
          {/* Price & Quantity Selector */}
          <View style={styles.priceQuantityContainer}>
            <Text style={styles.price}>
              ₹{product.price}
              {product.discount_price && (
                <Text style={styles.discountPrice}> ₹{product.discount_price}</Text>
              )}
            </Text>
            
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.quantityTextContainer}>
                <Animated.Text style={[styles.quantity, { transform: [{ scale: quantityScale }] }]}>
                  {quantity}
                </Animated.Text>
                <Text style={styles.quantityLabel}>
                  {product.stock_quantity !== undefined && 
                    `(${Math.min(product.stock_quantity, 999)} available)`}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={increaseQuantity} 
                style={[
                  styles.quantityButton,
                  product.stock_quantity !== undefined && quantity >= product.stock_quantity ? 
                    styles.disabledButton : {}
                ]}
                disabled={product.stock_quantity !== undefined && quantity >= product.stock_quantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Product Details */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text 
            style={styles.productDetails} 
            numberOfLines={expanded ? undefined : 3}
          >
            {product.details || product.description || 'No detailed information available for this product.'}
          </Text>
          
          {!expanded && (
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          )}
          
          {/* Features */}
          <View style={styles.featuresContainer}>
            {productFeatures.map((feature, index) => (
              <View key={index} style={styles.featurePill}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
            {product.stock !== undefined && (
              <View style={[
                styles.featurePill,
                { backgroundColor: product.stock > 0 ? '#E8F5E9' : '#FFEBEE' }
              ]}>
                <Text style={styles.featureIcon}>
                  {product.stock > 0 ? '✅' : '⚠️'}
                </Text>
                <Text style={[
                  styles.featureText,
                  { color: product.stock > 0 ? '#2E7D32' : '#C62828' }
                ]}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Reviews Preview */}
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          
          {reviews.length > 0 ? (
            <>
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerAvatar}>{review.avatar}</Text>
                    <View>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <StarRating rating={review.rating} size={14} />
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
              
              <TouchableOpacity style={styles.seeAllReviews}>
                <Text style={styles.seeAllReviewsText}>See All Reviews →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet. Be the first to review this product!</Text>
          )}
        </View>
      </ScrollView>
      
      {/* Header with conditional visibility */}
      <View style={[styles.header, { backgroundColor: headerVisible ? '#FFFFFF' : 'transparent' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: headerVisible ? '#333333' : '#FFFFFF' }]}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: headerVisible ? '#333333' : 'transparent' }]}>
          {product?.name || 'Product Details'}
        </Text>
        
        <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
          <Text style={[
            styles.headerButtonText, 
            { color: isFavorite ? '#F44336' : (headerVisible ? '#333333' : '#FFFFFF') }
          ]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Action Bar */}
      {renderActionButtons()}
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    paddingTop: 45,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: height * 0.4,
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 16,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  star: {
    marginRight: 2,
  },
  starFilled: {
    color: '#FFC107',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  reviewText: {
    fontSize: 14,
    color: '#777777',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  discountPrice: {
    fontSize: 14,
    color: '#757575',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#333333',
  },
  quantityTextContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  productDetails: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    fontSize: 20,
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },
  seeAllReviews: {
    alignItems: 'center',
    marginTop: 8,
  },
  seeAllReviewsText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
  },
  actionBar: {
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
  priceContainer: {
    flex: 1,
  },
  actionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  taxText: {
    fontSize: 12,
    color: '#777777',
  },
  addToCartButton: {
    backgroundColor: '#FF9800',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: '65%',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outOfStockButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: '65%',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#BDBDBD',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: '65%',
    alignItems: 'center',
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
  },
});

export default ProductDetailScreen;

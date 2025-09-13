import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import productService from '../services/Products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProductsScreen = ({ navigation, route }) => {
  const { shopId, shopName } = route.params || { shopId: null, shopName: 'Shop' };
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addedProductIds, setAddedProductIds] = useState({});

  // Get cart context
  const { addToCart: addItemToCart, cartItems, subtotal } = useCart();
  const { isAuthenticated, requireAuth } = useAuth();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cartAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  // Effect to filter products based on search query
  useEffect(() => {
    if (!products) return;
    
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
        (product.category_name && product.category_name.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    if (!shopId) {
      setError('Shop ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllShopProduct(shopId);
      if (response && response.data && Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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

  const addToCart = async (productData) => {
    // Check if user is authenticated
    const isAuthed = requireAuth({
      feature: 'cart',
      title: 'Sign in to Add to Cart',
      message: 'Create an account or sign in to add items to your cart.',
      returnTo: 'Products',
      returnParams: { shopId, shopName }
    });
    
    if (!isAuthed) {
      return;
    }
    
    try {
      // Handle both cases - when passed a product object or just an ID
      let product, productId;
      
      if (typeof productData === 'object') {
        // If a product object was passed
        product = productData;
        productId = product.product_id;
      } else {
        // If just an ID was passed
        productId = productData;
        // Find the product in the products array
        product = products.find(p => p.product_id === productId);
        if (!product) {
          console.error('Product not found:', productId);
          return;
        }
      }
      
      // Convert product_id to number if it's a string
      const parsedProductId = typeof productId === 'string' 
        ? parseInt(productId, 10) 
        : productId;
      
      // Animation for adding to cart
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Add to actual cart using the context
      const result = await addItemToCart({
        product_id: parsedProductId,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.primary_image_url
      }, {
        routeName: 'Products',
        params: { shopId, shopName }
      });
      
      if (result?.success) {
        // Show "Added" state for this product
        setAddedProductIds(prev => ({
          ...prev,
          [productId]: true
        }));
        
        // Animate cart button for confirmation
        Animated.sequence([
          Animated.timing(cartAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(cartAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          })
        ]).start();
        
        // Reset back to normal after 2 seconds
        setTimeout(() => {
          setAddedProductIds(prev => ({
            ...prev,
            [productId]: false
          }));
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert(
        "Error",
        "Failed to add item to cart. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  const renderProductItem = ({ item }) => {
    // Check if this product is in the "added" state
    const isAdded = addedProductIds[item.product_id] || false;
    
    return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.product_id })}
    >
      <Image 
        source={{ 
          uri: item.primary_image_url
        }} 
        style={styles.productImage}
        // defaultSource={require('../../assets/images/placeholder.png')}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || item.category_name || 'No description'}
        </Text>
        <Text style={styles.productPrice}>
          ₹{item.price}
          {item.discount_price && <Text style={styles.discountPrice}> ₹{item.discount_price}</Text>}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>{isAdded ? 'Added ✓' : '+'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  };

  // Category chip renderer is preserved but not currently used
  /* 
  const renderCategoryChip = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.activeCategoryChip
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.activeCategoryText
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
  */

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{shopName || 'Products'}</Text>
        <View style={styles.cartContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartScreen')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products in this shop…"
            placeholderTextColor="#9E9E9E"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⏷</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter - Temporarily hidden */}
      {/* 
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>
      */}

      {/* Product Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.product_id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>No products found</Text>
          {searchQuery ? (
            <Text style={styles.emptyText}>
              No products match your search "{searchQuery}".
              Try a different search term or browse all products.
            </Text>
          ) : (
            <Text style={styles.emptyText}>
              There are no products available in this shop yet.
            </Text>
          )}
          {searchQuery ? (
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.browseButtonText}>Clear Search</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      {/* Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <Animated.View 
          style={[
            styles.cartBar,
            { transform: [{ translateY: cartAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            }) }] }
          ]}
        >
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemsText}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Text>
            <Text style={styles.cartTotalText}>₹{subtotal}</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartActionButton}
            onPress={() => navigation.navigate('CartScreen')}
          >
            <Text style={styles.cartActionText}>Go to Cart →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#212121',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    textAlign: 'center',
  },
  cartContainer: {
    position: 'relative',
  },
  cartButton: {
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
    color: '#9E9E9E',
  },
  clearIcon: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  filterIcon: {
    fontSize: 18,
    color: '#616161',
  },
  categoryContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryText: {
    color: '#616161',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  productGrid: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 8,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  discountPrice: {
    fontSize: 12,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FF9800',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#616161',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cartActionButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  cartActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductsScreen;

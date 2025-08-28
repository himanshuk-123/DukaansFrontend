import React, { useState, useRef } from 'react';
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
  SafeAreaView
} from 'react-native';

const { width } = Dimensions.get('window');

const ProductsScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState(3);
  const [cartTotal, setCartTotal] = useState(250);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Apples',
      description: 'Fresh from farm',
      price: '₹120',
      image: 'https://cdn.pixabay.com/photo/2017/09/26/13/42/apple-2788662_1280.jpg',
      category: 'Fruits'
    },
    {
      id: 2,
      name: 'Bananas',
      description: '1 dozen',
      price: '₹50',
      image: 'https://cdn.pixabay.com/photo/2017/06/27/22/21/banana-2449019_1280.jpg',
      category: 'Fruits'
    },
    {
      id: 3,
      name: 'Carrots',
      description: 'Fresh organic',
      price: '₹40',
      image: 'https://cdn.pixabay.com/photo/2017/06/09/17/36/carrots-2387394_1280.jpg',
      category: 'Vegetables'
    },
    {
      id: 4,
      name: 'Milk',
      description: 'Amul, 1L',
      price: '₹65',
      image: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg',
      category: 'Dairy'
    },
    {
      id: 5,
      name: 'Potatoes',
      description: '1kg pack',
      price: '₹30',
      image: 'https://cdn.pixabay.com/photo/2016/08/11/08/49/potatoes-1585075_1280.jpg',
      category: 'Vegetables'
    },
    {
      id: 6,
      name: 'Chips',
      description: 'Lays, 50g',
      price: '₹20',
      image: 'https://cdn.pixabay.com/photo/2016/11/20/09/06/bowl-1842294_1280.jpg',
      category: 'Snacks'
    },
  ]);

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Snacks'];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cartAnim = useRef(new Animated.Value(0)).current;

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

  const addToCart = (productId) => {
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

    // Update cart
    setCartItems(cartItems + 1);
    setCartTotal(cartTotal + 100); // Simplified calculation

    // Show cart bar if it's the first item
    if (cartItems === 0) {
      Animated.timing(cartAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(item.id)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fresh Mart</Text>
        <View style={styles.cartContainer}>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems}</Text>
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
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⏷</Text>
        </TouchableOpacity>
      </View>
      
      <View>
        <TouchableOpacity onPress={()=>navigation.navigate('ProductDetail')}>
          <Text>View Product</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>No products found in this category.</Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse All Products</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Cart Bar */}
      {cartItems > 0 && (
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
            <Text style={styles.cartItemsText}>{cartItems} items</Text>
            <Text style={styles.cartTotalText}>₹{cartTotal}.00</Text>
          </View>
          <TouchableOpacity style={styles.cartActionButton}>
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
    backgroundColor: '#FF9800',
    borderRadius: 10,
    width: 18,
    height: 18,
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
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

const { width } = Dimensions.get('window');

const WishlistScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Organic Red Apples',
      price: '₹120',
      shop: 'Fresh Mart',
      image: 'https://cdn.pixabay.com/photo/2017/09/26/13/42/apple-2788662_1280.jpg',
      isLiked: true
    },
    {
      id: 2,
      name: 'Fresh Milk',
      price: '₹65',
      shop: 'Daily Dairy',
      image: 'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg',
      isLiked: true
    },
    {
      id: 3,
      name: 'Potatoes',
      price: '₹30',
      shop: 'Veggie King',
      image: 'https://cdn.pixabay.com/photo/2016/08/11/08/49/potatoes-1585075_1280.jpg',
      isLiked: true
    },
    {
      id: 4,
      name: 'Whole Wheat Bread',
      price: '₹40',
      shop: 'Bakery Corner',
      image: 'https://cdn.pixabay.com/photo/2014/07/22/09/59/bread-399286_1280.jpg',
      isLiked: true
    },
    {
      id: 5,
      name: 'Organic Eggs',
      price: '₹80',
      shop: 'Fresh Mart',
      image: 'https://cdn.pixabay.com/photo/2015/09/17/17/19/egg-944495_1280.jpg',
      isLiked: true
    },
    {
      id: 6,
      name: 'Bananas',
      price: '₹50',
      shop: 'Fruit Paradise',
      image: 'https://cdn.pixabay.com/photo/2017/06/27/22/21/banana-2449019_1280.jpg',
      isLiked: true
    }
  ]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation for heart icon
  const animateHeart = (itemId) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Remove item after animation
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    });
  };

  // Animation for add to cart button
  const animateAddToCart = (itemId) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        delay: 500,
      })
    ]).start();
  };

  const removeFromWishlist = (itemId) => {
    animateHeart(itemId);
  };

  const moveToCart = (itemId) => {
    animateAddToCart(itemId);
    // In a real app, you would move the item to cart here
    // For now, we'll just show a success message
    setTimeout(() => {
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    }, 1000);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const renderGridItem = ({ item }) => (
    <Animated.View style={[styles.productCard, viewMode === 'grid' ? styles.gridCard : styles.listCard]}>
      <TouchableOpacity 
        style={styles.heartButton}
        onPress={() => removeFromWishlist(item.id)}
      >
        <Animated.Text style={[styles.heartIcon, { transform: [{ scale: scaleAnim }] }]}>
          {item.isLiked ? '❤️' : '🤍'}
        </Animated.Text>
      </TouchableOpacity>
      
      <Image source={{ uri: item.image }} style={viewMode === 'grid' ? styles.gridImage : styles.listImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.shopTag}>
          <Text style={styles.shopText}>{item.shop}</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => moveToCart(item.id)}
      >
        <Text style={styles.addToCartText}>Move to Cart</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderListItem = ({ item }) => (
    <Animated.View style={[styles.productCard, styles.listCard]}>
      <Image source={{ uri: item.image }} style={styles.listImage} />
      
      <View style={styles.listProductInfo}>
        <View style={styles.listHeader}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
            <Text style={styles.heartIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.shopTag}>
          <Text style={styles.shopText}>{item.shop}</Text>
        </View>
        
        <View style={styles.listFooter}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => moveToCart(item.id)}
          >
            <Text style={styles.addToCartText}>Move to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity onPress={toggleViewMode} style={styles.viewModeButton}>
          <Text style={styles.viewModeText}>{viewMode === 'grid' ? '☷' : '☰'}</Text>
        </TouchableOpacity>
      </View>

      {/* Wishlist Content */}
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={item => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={styles.listContent}
          key={viewMode} // Force re-render when view mode changes
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyHeart}>❤️</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyText}>Start saving your favorite items</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Animation */}
      <Animated.View style={[styles.successToast, { opacity: fadeAnim }]}>
        <Text style={styles.successText}>Item moved to cart!</Text>
      </Animated.View>
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
  viewModeButton: {
    padding: 8,
  },
  viewModeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  gridCard: {
    width: (width - 40) / 2,
    marginRight: 8,
    padding: 12,
  },
  listCard: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  heartIcon: {
    fontSize: 20,
    color: '#FF9800',
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  listProductInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
    flex: 1,
  },
  shopTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  shopText: {
    fontSize: 12,
    color: '#616161',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addToCartButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyHeart: {
    fontSize: 64,
    marginBottom: 16,
    color: '#FF9800',
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
  successToast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WishlistScreen;
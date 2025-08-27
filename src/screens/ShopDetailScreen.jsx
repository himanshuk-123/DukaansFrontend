import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Animated } from 'react-native';
import React, { useRef, useState } from 'react';

const ShopDetailScreen = ({ navigation,route }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {item} = route.params
  
  // Sample products data
  const products = [
    { id: 1, name: "Apple (1kg)", price: "₹120", emoji: "🍎" },
    { id: 2, name: "Amul Milk 1L", price: "₹65", emoji: "🥛" },
    { id: 3, name: "Oreo Biscuit", price: "₹30", emoji: "🍪" },
    { id: 4, name: "Banana (dozen)", price: "₹50", emoji: "🍌" },
    { id: 5, name: "Bread", price: "₹40", emoji: "🍞" },
  ];

  // Sample reviews data
  const reviews = [
    { id: 1, name: "Ramesh", rating: 5, comment: "Good quality!" },
    { id: 2, name: "Anita", rating: 4, comment: "Fast delivery" },
    { id: 3, name: "Vikram", rating: 5, comment: "Fresh products and good service" },
  ];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const StarRating = ({ rating }) => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={i < rating ? styles.starFilled : styles.starEmpty}>
            {i < rating ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Shop Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image 
            source={{ uri: 'https://www.gfreshmart.com/static-assets/images/g-fresh-mart-supermarket-franchise.webp' }} 
            style={styles.coverImage}
          />
          <View style={styles.overlay} />
          
          {/* Shop Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://www.gfreshmart.com/static-assets/images/g-fresh-mart-supermarket-franchise.webp' }} 
              style={styles.logo}
            />
          </View>
        </View>

        {/* Shop Info Section */}
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>Fresh Mart</Text>
          
          <View style={styles.categoryRatingContainer}>
            <View style={styles.categories}>
              <Text style={styles.category}>Grocery</Text>
              <Text style={styles.category}>Dairy</Text>
              <Text style={styles.category}>Snacks</Text>
            </View>
            <View style={styles.ratingContainerMain}>
              <StarRating rating={4.5} />
              <Text style={styles.ratingText}>4.5 (200 reviews)</Text>
            </View>
          </View>
          
          <View style={styles.distanceContainer}>
            <Text style={styles.distance}>📍 1.2 km away</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.actionButtonIcon}>📞</Text>
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.actionButtonIcon}>🗺️</Text>
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.actionButtonIcon}>🔗</Text>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={[styles.actionButton, isFavorite && styles.favoriteActive]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Text style={[styles.actionButtonIcon, isFavorite && styles.favoriteIcon]}>{isFavorite ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionButtonText, isFavorite && styles.favoriteText]}>Favorite</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Shop Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>XYZ Street, Lucknow</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hours:</Text>
            <Text style={[styles.detailValue, styles.openNow]}>Open Now • Closes 9 PM</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery:</Text>
            <Text style={styles.detailValue}>✅ Home Delivery | 💳 UPI, Cash</Text>
          </View>
        </View>

        {/* Search and Categories */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search Products 🔍"
              style={styles.searchInput}
              placeholderTextColor="#616161"
            />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
              <Text style={[styles.categoryButtonText, styles.categoryButtonTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>Grocery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>Snacks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>Beverages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>Dairy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Products List */}
        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          
          {products.map(product => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsContainer}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>⭐ Reviews (4.5 avg)</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>👤 {review.name}</Text>
                <StarRating rating={review.rating} />
              </View>
              <Text style={styles.reviewComment}>"{review.comment}"</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.writeReviewButton}>
            <Text style={styles.writeReviewText}>Write a Review ✍️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Cart Button */}
      <View style={styles.cartContainer}>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>View Cart (2 items)</Text>
            <Text style={styles.cartPrice}>– ₹185</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
    // paddingVertical: 12,
    backgroundColor: '#2E7D32',
    paddingTop: 0,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  coverImageContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  shopInfo: {
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  shopName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 8,
  },
  categoryRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  category: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainerMain: {
    alignItems: 'flex-end',
  },
  ratingText: {
    color: '#616161',
    fontSize: 12,
    marginTop: 4,
  },
  distanceContainer: {
    marginTop: 4,
  },
  distance: {
    color: '#616161',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    minWidth: 70,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionButtonText: {
    color: '#212121',
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteActive: {
    backgroundColor: '#FFECEC',
  },
  favoriteIcon: {
    color: '#F44336',
  },
  favoriteText: {
    color: '#F44336',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#212121',
    width: 80,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    color: '#616161',
    fontSize: 14,
  },
  openNow: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2E7D32',
  },
  categoryButtonText: {
    color: '#616161',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  productsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  reviewsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 80,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: '600',
    color: '#212121',
  },
  reviewComment: {
    color: '#616161',
    fontSize: 14,
    lineHeight: 20,
  },
  writeReviewButton: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  writeReviewText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    color: '#FF9800',
    fontSize: 14,
  },
  starEmpty: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cartButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  cartIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
  cartPrice: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default ShopDetailScreen;
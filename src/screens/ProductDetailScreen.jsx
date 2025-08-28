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
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  
  // Sample product data
  const product = {
    id: 1,
    name: 'Organic Red Apples',
    description: 'Freshly picked organic red apples from local farms. Crisp, sweet, and perfect for snacking or baking.',
    price: '₹120',
    image: 'https://cdn.pixabay.com/photo/2017/09/26/13/42/apple-2788662_1280.jpg',
    rating: 4.5,
    reviews: 200,
    details: 'These organic apples are grown without synthetic pesticides or fertilizers. They are hand-picked at peak ripeness to ensure the best flavor and texture. Each apple is carefully selected for quality and freshness.',
    features: [
      { icon: '🍃', text: '100% Fresh' },
      { icon: '🚚', text: 'Free Delivery' },
      { icon: '🌿', text: 'Organic' }
    ]
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      rating: 5,
      comment: 'Very fresh and sweet apples. Will definitely buy again!',
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
  const animateAddToCart = () => {
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
    }, 1500);

  };

  const increaseQuantity = () => {
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
    setIsFavorite(!isFavorite);
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
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
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          
          <View style={styles.ratingContainer}>
            <StarRating rating={product.rating} />
            <Text style={styles.reviewText}>({product.reviews} reviews)</Text>
          </View>
          
          <View style={styles.divider} />
          
          {/* Price & Quantity Selector */}
          <View style={styles.priceQuantityContainer}>
            <Text style={styles.price}>{product.price}</Text>
            
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <Animated.Text style={[styles.quantity, { transform: [{ scale: quantityScale }] }]}>
                {quantity}
              </Animated.Text>
              
              <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
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
            {product.details}
          </Text>
          
          {!expanded && (
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          )}
          
          {/* Features */}
          <View style={styles.featuresContainer}>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featurePill}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
          
          {/* Reviews Preview */}
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          
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
        </View>
      </ScrollView>
      
      {/* Header with conditional visibility */}
      <View style={[styles.header, { backgroundColor: headerVisible ? '#FFFFFF' : 'transparent' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: headerVisible ? '#333333' : '#FFFFFF' }]}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: headerVisible ? '#333333' : 'transparent' }]}>
          Product Details
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
      <View style={styles.actionBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.actionPrice}>{product.price}</Text>
          <Text style={styles.taxText}>incl. taxes</Text>
        </View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={animateAddToCart}
            activeOpacity={0.9}
          >
            <Text style={styles.addToCartText}>
              {addedToCart ? 'Added ✓' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
});

export default ProductDetailScreen;
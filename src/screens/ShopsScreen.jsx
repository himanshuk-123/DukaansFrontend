import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Shops from "../services/Shops";
import { useLocation } from "../context/LocationContext";

const { width } = Dimensions.get('window');

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <View style={styles.ratingContainer}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Text key={i} style={styles.star}>★</Text>;
        } else if (i === fullStars && hasHalfStar) {
          return <Text key={i} style={styles.star}>☆</Text>;
        } else {
          return <Text key={i} style={styles.star}>☆</Text>;
        }
      })}
      <Text style={styles.ratingText}>({rating})</Text>
    </View>
  );
};

const ShopsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { categoryId, categoryName } = route.params || { categoryId: null, categoryName: 'All' };
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();

  const fetchShops = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching shops with categoryId:', categoryId, 'and categoryName:', categoryName);
      
      const res = await Shops.getAllShops(location, categoryId);
      console.log('Shops fetched:', res.data);
      // Log the entire response structure to debug
      console.log('Full response data structure:', JSON.stringify(res.data));
      
      // Check if data is available and correctly structured
      if (res.data && res.data.data) {
        setShops(res.data.data);
        console.log(`Found ${res.data.data.length} shops for category: ${categoryName}`);
      } else if (res.data && Array.isArray(res.data)) {
        // If the API returns the array directly instead of in a data property
        setShops(res.data);
        console.log(`Found ${res.data.length} shops for category: ${categoryName}`);
      } else {
        setShops([]);
        console.warn('Unexpected API response structure:', res.data);
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError('Failed to fetch shops. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [location, categoryId, categoryName]);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      fetchShops();
    } else if (!locationLoading && locationError) {
      setIsLoading(false);
      Alert.alert(
        'Location Error',
        'Could not get your location. Some features may be limited.',
        [{ text: 'Try Again', onPress: getCurrentLocation }]
      );
    }
  }, [location, locationLoading, locationError, fetchShops, getCurrentLocation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCurrentLocation();
    fetchShops();
  }, [getCurrentLocation, fetchShops]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const formatDistance = (distance) => {
    if (!distance && distance !== 0) return 'Unknown';
    
    if (distance < 1) {
      // Convert to meters and round
      return `${Math.round(distance * 1000)}m`;
    }
    // Round to 1 decimal place for kilometers
    return `${distance.toFixed(1)}km`;
  };

  const renderShopCard = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('ShopDetail', { item: item })}
        key={item.shop_id}
      >
        {/* Shop Image with Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.logo_url }} style={styles.shopImage} />
          <View style={styles.imageOverlay} />
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <StarRating rating={item.average_rating} />
          </View>

          {/* Distance Badge */}
          {item.distance !== undefined && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
            </View>
          )}
        </View>

        {/* Shop Info */}
        <View style={styles.infoContainer}>
          {/* Shop Name */}
          <Text style={styles.categoryName}>{item.shop_name}</Text>
          
          {/* Category Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{item.category_name || 'General'}</Text>
          </View>
          
          {/* Owner Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner:</Text>
            <Text style={styles.infoValue}>{item.owner_name || 'Unknown'}</Text>
          </View>
          
          {/* Timing Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hours:</Text>
            <Text style={styles.infoValue}>{item.opening_hours}</Text>
          </View>
          
          {/* Location Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{item.address}</Text>
          </View>
          
          {/* Visit Button */}
          <TouchableOpacity 
            style={styles.visitButton} 
            onPress={() => navigation.navigate('ShopDetail', { item: item })}
          >
            <Text style={styles.visitButtonText}>Visit Shop</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderContent = () => {
    if (isLoading || locationLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Finding shops near you...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchShops}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!shops || shops.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076478.png' }} 
            style={styles.noShopsImage} 
          />
          <Text style={styles.noShopsText}>No shops found nearby</Text>
          <Text style={styles.noShopsSubtext}>Try changing your location or checking again later</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
          {/* Debug info */}
          <Text style={styles.debugText}>Location: {JSON.stringify(location)}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={shops}
        renderItem={renderShopCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.shop_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{categoryName} Shops</Text>
        <Text style={styles.subtitle}>Find the best shops near you</Text>
        <Text>{categoryId}</Text>
      </View>

      {/* Location Indicator */}
      {location && (
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={getCurrentLocation}
        >
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
            style={styles.locationIcon} 
          />
          <Text style={styles.locationText}>
            Using your current location
          </Text>
        </TouchableOpacity>
      )}

      {/* Shops List or Loading/Error State */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Background color
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121", // Primary text color
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#616161", // Secondary text color
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: '#2E7D32',
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  shopImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FF9800', // Secondary color for stars
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
    color: '#212121', // Primary text color
  },
  infoContainer: {
    padding: 16,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121", // Primary text color
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#616161", // Secondary text color
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: "#212121", // Primary text color
    flex: 1,
  },
  visitButton: {
    backgroundColor: '#2E7D32', // Primary color
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  visitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#616161',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noShopsImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#9E9E9E',
  },
  noShopsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#616161',
    marginBottom: 8,
  },
  noShopsSubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugText: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ShopsScreen;


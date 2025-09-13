import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
  PermissionsAndroid, Platform,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Card from '../components/Card';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import pro from '../services/auth.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Categories from '../services/Categories.js';
import Geolocation from 'react-native-geolocation-service';
import { useLocation } from '../context/LocationContext.js';
import { useAuth } from '../context/AuthContext.js';
// import {useOrder} from '../context/OrderContext.js'
const LocalMarketScreen = () => {
  const { authState } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // const {fetchOrders} = useOrder();
  const { location } = useLocation();
  
  // Track the last time we fetched categories to prevent too many calls
  // const lastFetchTime = useRef(0);
  
  // Minimum time between fetches in milliseconds (5 seconds)
  // const FETCH_COOLDOWN = 5000;

  // Fetch categories with simple throttling
  const fetchCategories = async () => {    
    try {
      setLoading(true);
      setError(null);
      const res = await Categories.getAllCategories();
      // const orders = await fetchOrders();
      // console.log(orders);
      
      if (res && res.data) {
        // Check if data is directly the array or nested in a data property
        const categoriesData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Check if it's a rate limit error
      if (err.response?.status === 429) {
        setError('Too many requests. Please try again in a few minutes.');
      } else {
        setError(err.message || 'Failed to fetch categories');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategories(true);
  };

  useEffect(() => {
    fetchCategories();
    
    // Also fetch when screen comes into focus, but respect throttling
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCategories();
    });
    
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <Card
      title={item.name}
      image={item.icon_url}
      onPress={() => navigation.navigate('Shops', { categoryId: item.category_id, categoryName: item.name })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header Section */}
      <Header />
      {/* 2. Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.locationButton}
          >
            <Image
              source={require('../../assets/images/location.png')}
              style={styles.locationIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products or shops..."
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* 3. Categories Section */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchCategories(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : categories && categories.length > 0 ? (
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={item => item.category_id?.toString() || Math.random().toString()}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.noDataText}>No categories found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10B981', // Green accent color
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },

  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationButton: {
    marginRight: 8,
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: '#10B981', // Green accent color
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0, // Remove default padding on Android
  },

  // Categories Section Styles
  categorySection: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 8,
    color: '#333',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LocalMarketScreen;

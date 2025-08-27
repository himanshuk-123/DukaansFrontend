import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import Card from '../components/Card';
import Header from '../components/Header'
import { useNavigation } from '@react-navigation/native';
// Static array of categories
const categories = [
  {
    id: '1',
    title: 'Groceries',
    image: require('../../assets/images/grocery.jpg'),
  },
  {
    id: '2',
    title: 'Electronics',
    image: require('../../assets/images/elect.jpg'),
  },
  {
    id: '3',
    title: 'Fashion',
    image: require('../../assets/images/fashion.jpeg'),
  },
  {
    id: '4',
    title: 'Home & Kitchen',
    image: require('../../assets/images/home.jpeg'),
  },
  {
    id: '5',
    title: 'Groceries',
    image: require('../../assets/images/grocery.jpg'),
  },
  {
    id: '6',
    title: 'Electronics',
    image: require('../../assets/images/elect.jpg'),
  },
  {
    id: '7',
    title: 'Fashion',
    image: require('../../assets/images/fashion.jpeg'),
  },
  {
    id: '8',
    title: 'Home & Kitchen',
    image: require('../../assets/images/home.jpeg'),
  },
];

const LocalMarketScreen = () => {
  const navigation = useNavigation();
  // Card renderer for the FlatList
  const renderItem = ({ item }) => (
    <Card
      title={item.title}
      image={item.image}
      onPress={() => navigation.navigate('shops',{shopName: item.title})}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. Header Section */}
      <Header />

      {/* 2. Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity style={styles.locationButton}>
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
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
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
});

export default LocalMarketScreen;

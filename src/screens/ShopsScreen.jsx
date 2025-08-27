import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from "react-native";
import React, { useRef } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
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
const ShopsScreen = ({ route,starRating }) => {
  const navigation = useNavigation();
  const { shopName } = route.params;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Static shops data
  const shops = [
    {
      id: "1",
      name: "Fresh Mart",
      image: "https://www.gfreshmart.com/static-assets/images/g-fresh-mart-supermarket-franchise.webp",
      owner: "Rajesh Kumar",
      opening: "9:00 AM",
      closing: "9:00 PM",
      location: "Sector 15, Noida",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Daily Needs",
      image: "https://content3.jdmagicbox.com/v2/comp/delhi/c2/011pxx11.xx11.210627170518.i3c2/catalogue/-jru0rzccvz.jpg",
      owner: "Anita Sharma",
      opening: "8:00 AM",
      closing: "10:00 PM",
      location: "MG Road, Delhi",
      rating: 4.2,
    },
    {
      id: "3",
      name: "Super Store",
      image: "https://content.jdmagicbox.com/comp/jaipur/q8/0141px141.x141.200930004614.k7q8/catalogue/narayan-super-store-hathoj-jaipur-grocery-stores-hlogj0m3fn.jpg",
      owner: "Vikram Singh",
      opening: "10:00 AM",
      closing: "11:00 PM",
      location: "Hazratganj, Lucknow",
      rating: 4.8,
    },
  ];

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



  const renderShopCard = ({ item }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Shop Image with Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.shopImage} />
          <View style={styles.imageOverlay} />
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <StarRating rating={item.rating} />
          </View>
        </View>

        {/* Shop Info */}
        <View style={styles.infoContainer}>
          {/* Shop Name */}
          <Text style={styles.shopName}>{item.name}</Text>
          
          {/* Owner Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner:</Text>
            <Text style={styles.infoValue}>{item.owner}</Text>
          </View>
          
          {/* Timing Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hours:</Text>
            <Text style={styles.infoValue}>{item.opening} - {item.closing}</Text>
          </View>
          
          {/* Location Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{item.location}</Text>
          </View>
          
          {/* Visit Button */}
          <TouchableOpacity style={styles.visitButton} onPress={() => {navigation.navigate('shopDetail',{item:item})}}>
            <Text style={styles.visitButtonText}>Visit Shop</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{shopName} Shops</Text>
        <Text style={styles.subtitle}>Find the best shops near you</Text>
      </View>

      {/* Shops List */}
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={renderShopCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  shopName: {
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
});

export default ShopsScreen;
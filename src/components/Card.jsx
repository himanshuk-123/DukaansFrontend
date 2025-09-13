import { Text, Image, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30; // 2 columns with spacing

/**
 * Card component for displaying items in a grid
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {Object} props.image - Image source
 * @param {Function} props.onPress - Function to call when card is pressed
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.price] - Optional price text
 * @param {boolean} [props.showBadge] - Whether to show badge on card
 * @param {string} [props.badgeText] - Text to show in badge
 */
const Card = ({ 
  title, 
  image, 
  onPress, 
  subtitle,
  price,
  showBadge = false,
  badgeText
}) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{uri:image}}
        style={styles.image}
        resizeMode="cover"
      />
      
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
        
        {price && (
          <Text style={styles.price}>{price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    width: cardWidth,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  contentContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#212121',
  },
  subtitle: {
    fontSize: 14,
    color: '#616161',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Card;

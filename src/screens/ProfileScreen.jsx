import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // User data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    orders: 12,
    wishlist: 8,
  };

  // Menu items
  const menuItems = [
    { id: 1, title: 'Orders', icon: '📦', count: user.orders, color: '#FF9E80' },
    { id: 2, title: 'Saved Items', icon: '❤️', count: user.wishlist, color: '#FF80AB' },
    { id: 3, title: 'Payment Methods', icon: '💳', color: '#80CBC4' },
    { id: 4, title: 'Settings', icon: '⚙️', color: '#90CAF9' },
    { id: 5, title: 'Help & Support', icon: '❓', color: '#CE93D8' },
    { id: 6, title: 'Logout', icon: '🚪', color: '#EF5350' },
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

  const handleMenuItemPress = (item) => {
    if (item.title === 'Logout') {
      // Handle logout logic
      console.log('Logout pressed');
    }
    if(item.title==='Saved Items') {
      // Navigate to appropriate screen
      navigation.navigate('WishList');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.avatarBorder} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.editButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.wishlist}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.count !== undefined && (
                <View style={[styles.countBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.countText}>{item.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarBorder: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    top: -4,
    left: -4,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    backgroundGradient: {
      colors: ['#14B8A6', '#8B5CF6'],
      start: [0, 0],
      end: [1, 1],
    },
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#14B8A6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#14B8A6',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 24,
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14B8A6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  menuItem: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF9E80',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Gradient border workaround for React Native
const GradientBorderView = ({ children, style }) => {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{
          flex: 1,
          backgroundColor: '#14B8A6',
          opacity: 0.3,
          borderWidth: 2,
          borderColor: 'transparent',
          borderRadius: style.borderRadius || 0,
        }} />
      </View>
      {children}
    </View>
  );
};

export default ProfileScreen;
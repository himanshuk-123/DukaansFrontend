import { View, FlatList, StyleSheet,Text } from 'react-native';
import React from 'react';
import Card from '../src/components/Card';

// Static array of categories
const categories = [
  {
    id: '1',
    title: 'Groceries',
    image: require('../assets/images/grocery.jpg'), // You'll need to add these images to your assets folder
  },
  {
    id: '2',
    title: 'Electronics',
    image: require('../assets/images/elect.jpg'),
  },
  {
    id: '3',
    title: 'Fashion',
    image: require('../assets/images/fashion.jpeg'),
  },
  {
    id: '4',
    title: 'Home & Kitchen',
    image: require('../assets/images/home.jpeg'),
  },
];

const CategoryScreen = () => {
  const renderItem = ({ item }) => (
    <Card
      title={item.title}
      image={item.image}
      onPress={() => console.log(`Selected category: ${item.title}`)}
    />
  );

  return (
    <View style={styles.container}>
      <View>
        <Text>Categories</Text>
        <View>
          <Image source={require('../assets/images/grocery.jpg')} />
        </View>
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  listContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default CategoryScreen;

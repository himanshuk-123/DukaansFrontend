  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import { NavigationContainer } from "@react-navigation/native";
  import LocalMarketScreen from '../screens/LocalMarketScreen'
  import shopsScreen from '../screens/ShopsScreen'
  import shopDetailScreen from '../screens/ShopDetailScreen'
  import ProductsScreen from '../screens/ProductsScreen'
  import ProductDetail from '../screens/ProductDetailScreen'
  import CartScreen from '../screens/CartScreen'
  import Checkout from '../screens/CheckoutScreen'
  import Profile from '../screens/ProfileScreen'
  import WishlistScreen from '../screens/WishListScreen.jsx'
  const Stack = createNativeStackNavigator();

  const RootNavigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} >
          <Stack.Screen name="LocalMarket" component={LocalMarketScreen} />
          <Stack.Screen name="shops" component={shopsScreen} />
          <Stack.Screen name="shopDetail" component={shopDetailScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="WishList" component={WishlistScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  export default RootNavigator;

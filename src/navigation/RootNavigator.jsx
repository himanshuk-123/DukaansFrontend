  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import { NavigationContainer } from "@react-navigation/native";
  import LocalMarketScreen from '../screens/LocalMarketScreen'
  import shopsScreen from '../screens/ShopsScreen'
  import shopDetailScreen from '../screens/ShopDetailScreen'
  const Stack = createNativeStackNavigator();

  const RootNavigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} >
          <Stack.Screen name="LocalMarket" component={LocalMarketScreen} />
          <Stack.Screen name="shops" component={shopsScreen} />
          <Stack.Screen name="shopDetail" component={shopDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  export default RootNavigator;

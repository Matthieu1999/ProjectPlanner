import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import ProjectScreen from './screens/ProjectScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      {/* <Drawer.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} /> */}
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Home" component={HomeScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Account" component={AccountScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Projects" component={ProjectScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>

      {/* <MyDrawer/> */}

      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false}} name="Home" component={MyDrawer} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

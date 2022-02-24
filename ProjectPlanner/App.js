import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { auth } from './firebase'

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProjectScreen from './screens/ProjectScreen';
import AccountScreen from './screens/AccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import FeedbackScreen from './screens/FeedbackScreen';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    
    <Drawer.Navigator>
      <Drawer.Screen options={{
        headerTitle: 'Home',
        headerTitleAlign: 'center',
      }} name="Root" component={HomeScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Projects" component={ProjectScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Account" component={AccountScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
      }} name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
    
  );
}


export default function App() {
  
  return (
    <NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen options={{ headerShown: true,
        headerTitleAlign: 'center',
        }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: true,
        headerTitleAlign: 'center',
         }} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false
        }} name="Home" component={MyDrawer} />
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

import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Appearance } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { auth, app, db } from './firebase'

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProjectScreen from './screens/ProjectScreen';
import AccountScreen from './screens/AccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import { CustomDrawer } from './components/CustomDrawer';

import {Ionicons, SimpleLineIcons} from '@expo/vector-icons'
import { useState } from 'react';

import darkMode from './styles/darkMode';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    
    <Drawer.Navigator 
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      drawerActiveBackgroundColor: '#aa18ea',
      drawerActiveTintColor: '#fff',
      drawerLabelStyle: {
        marginLeft: -25
      }
    }}
    >
      <Drawer.Screen options={{
        headerTitle: 'Home',
        headerTitleAlign: 'center',
        drawerIcon: ({color}) => (
          <Ionicons name="home-outline" size={22} color={color}/>
        )
      }} name="Homepage" component={HomeScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
        drawerIcon: ({color}) => (
          <Ionicons name="analytics-outline" size={22} color={color}/>
        )
      }} name="Projects" component={ProjectScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
        drawerIcon: ({color}) => (
          <Ionicons name="person-outline" size={22} color={color}/>
        )
      }} name="Account" component={AccountScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
        drawerIcon: ({color}) => (
          <SimpleLineIcons name="feed" size={22} color={color}/>
        )
      }} name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen options={{
        headerTitleAlign: 'center',
        drawerIcon: ({color}) => (
          <Ionicons name="settings-outline" size={22} color={color}/>
        )
      }} name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
    
  );
}


export default function App() {

  const [theme, setTheme] = useState(Appearance.getColorScheme())
  Appearance.addChangeListener((scheme) => {
    console.log(scheme.colorScheme)
  })
  
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
  
});

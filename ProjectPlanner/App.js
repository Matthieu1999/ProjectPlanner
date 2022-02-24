import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { auth } from './firebase'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();



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
        <Stack.Screen options={{ headerShown: true,
        headerTitleAlign: 'center',
        }} name="Home" component={HomeScreen} />
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

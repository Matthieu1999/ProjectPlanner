import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth, app, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {

  const navigation = useNavigation()

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.buttonContainer}>
      {/* <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
        >
          <Text style={styles.buttonText}>
            Sign out
          </Text>
        </TouchableOpacity> */}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})
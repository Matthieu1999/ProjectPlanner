import 'react-native-gesture-handler';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';

const AccountScreen = () => {
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    >

      <View style={styles.usernameContainer}>

        <Text style={styles.itemText}>Username:</Text>

        <TouchableOpacity>
          <Text>Change Username</Text>
        </TouchableOpacity>

      </View>
      
      <Text style={styles.itemText}>Email: {auth.currentUser?.email} </Text>
      
      <Text style={styles.itemText}>Password: ********** </Text>


    </KeyboardAvoidingView>
  )
}


export default AccountScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // alignItems: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


})
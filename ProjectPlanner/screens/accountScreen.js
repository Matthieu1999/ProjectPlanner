import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth } from '../firebase'

const AccountScreen = () => {
  return (
    <View>
      <Text>Username:</Text>
      <Text>Email: {auth.currentUser?.email} </Text>
      <Text>Password: ********** </Text>
    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({})
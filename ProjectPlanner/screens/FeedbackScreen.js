import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FeedbackScreen = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent:'center'
    }}
    >
      <Text style={{
        alignSelf:'center',
        fontSize: 30,
        width: '50%',
      }}>No feedback needed yet!</Text>
    </View>
  )
}

export default FeedbackScreen

const styles = StyleSheet.create({})
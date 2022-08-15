import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'

const SettingsScreen = () => {

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Text style={styles.txtCmngSn}>Coming soon</Text>
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Push Notifications</Text>
        <Text style={styles.txtCmngSn}>Coming soon</Text>
      </View>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  txtCmngSn: {
    fontStyle: 'italic',
  },

})
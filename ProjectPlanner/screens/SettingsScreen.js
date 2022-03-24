import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'

const SettingsScreen = () => {

  const [isEnabledDarkMode, setIsEnabledDarkMode] = useState(false);
  const toggleSwitchDarkMode = () => setIsEnabledDarkMode(previousState => !previousState);

  const [isEnabledNotifications, setIsEnabledNotifications] = useState(false);
  const toggleSwitchNotifications = () => setIsEnabledNotifications(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
        style={styles.settingSwitch}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabledDarkMode ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitchDarkMode}
        value={isEnabledDarkMode}
        />
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Push Notifications</Text>
        <Switch
        style={styles.settingSwitch}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabledNotifications ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitchNotifications}
        value={isEnabledNotifications}
        />
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
  settingText: {

  },
  settingSwitch: {

  },

})
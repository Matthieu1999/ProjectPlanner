import 'react-native-gesture-handler';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

import { onAuthStateChanged } from "firebase/auth";

const AccountScreen = () => {

  const [userName, setUserName] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        getCurrentUser();
      }
    });
  }, [])

  async function getCurrentUser() {
    if (auth.currentUser !== null) {
      setCurrentUser(auth.currentUser);
    }
  }

  async function updateUsername() {

    // console.log(currentUser.uid)
    // console.log(currentUser.email)
    // console.log(userName)

    await updateDoc(doc(db, "Users", currentUser.email), {
      displayName:userName
    }); 
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    >

      <View style={styles.usernameContainer}>

        <Text style={styles.itemText}>Username: </Text>

        <TextInput
        placeholder="Choose username"
        value={userName}
        onChangeText={text => setUserName(text)}
        style={styles.input}
        ></TextInput>

        <TouchableOpacity
        onPress={updateUsername}
        >
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
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },


})

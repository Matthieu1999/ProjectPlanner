import 'react-native-gesture-handler';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

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

    console.log(currentUser.uid)
    console.log(userName)

    const displayNameFirestore = query(collection(db, "Users"), where("userId", "==", "uYL0MWg9ONhdG7FaNEko9UsTcpp2"))

    await updateDoc(displayNameFirestore, {
      displayName: userName,
    });

    // const userNameFirestore = await updateDoc(collection(db, "Users"), where("userId", "==", currentUser.uid)) 
    // try {
    //   userNameFirestore, {
    //     displayName: userName,
    //   }
    //   console.log("Document written with ID: ", userNameFirestore.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
    
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
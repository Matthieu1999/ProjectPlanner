import 'react-native-gesture-handler';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

import { onAuthStateChanged } from "firebase/auth";

const AccountScreen = () => {

  const [userName, setUserName] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCurrentUser()
        setEmail(user.email)
      }
    });
  }, [])
  

  async function getCurrentUser() {
    if (auth.currentUser !== null) {
      setCurrentUser(auth.currentUser.uid);
      readUsername(auth.currentUser.email)
    }
  }

  async function updateUsername() {

    await updateDoc(doc(db, "Users", email), {
      displayName:userName
    }); 
    getCurrentUser()
  };

  async function readUsername(userEmail) {
    const docRef = doc(db, "Users", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserName(docSnap.data().displayName)
    } 
    else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

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
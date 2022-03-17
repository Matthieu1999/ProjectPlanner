import 'react-native-gesture-handler';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { auth, app, db } from '../firebase'
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider } 
from "firebase/auth";

import { useNavigation } from '@react-navigation/native';

import {Ionicons} from '@expo/vector-icons'

let dateLogin;

const RegisterScreen = () => {

  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Home")
      }
    })

    return unsubscribe;
  }, [])

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        // console.log('Registered with: ', user.email);
        createUserFirestore(user.uid)
      })
      .catch(error => alert(error.message))
  }

  async function createUserFirestore(uid) {

    try {
      await setDoc(doc(db, "Users", email), {
        userId: uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const provider = new GoogleAuthProvider();

  const googleAuth = () => {
    dateLogin = new Date();
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
    })
    .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
    >

      <View style={styles.inputContainer}>

        <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        >
        </TextInput>

        <TextInput
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        secureTextEntry
        >
        </TextInput>
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>
            Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        disabled={true}
        onPress={googleAuth}
        style={[styles.googleButton, styles.googleButtonOutline]}
        >
          <View style={styles.buttonWithIcon}>
          <Ionicons style={styles.icon} name="logo-google"/>
          
          <Text style={styles.googleButtonOutlineText}>
            Continue with Google
          </Text>
          </View>
          
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: 'blue',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: 'blue',
    width: '150%',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  googleButtonOutline: {
    backgroundColor: 'white',
    marginTop: 50,
    borderColor: 'grey',
    borderWidth: 1,
  },
  googleButtonOutlineText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonWithIcon: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 18,
    color: '#333',
  },

})
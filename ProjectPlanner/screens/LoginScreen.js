import 'react-native-gesture-handler';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,} from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { setDoc, doc } from "firebase/firestore";

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Projects")
      }
    })
    return unsubscribe;
  }, [])

  const handleLogin = () => {
    if(email ) {

    }

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
      })
      .catch(error => alert(error.message))
  }

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      createUserFirestore(user.uid)
    })
    .catch(error => alert(error.message))
  }

  async function createUserFirestore(uid) {
    try {
      await setDoc(doc(db, "Users", email.toLowerCase()), {
        userId: uid,
        displayName: "",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    
    <View
    style={styles.container}
    >
      <KeyboardAvoidingView style={styles.inputContainer}>
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
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <View style={styles.nrmlButtonContainer}>
          <TouchableOpacity
          onPress={handleSignUp}
          style={styles.buttonSignUp}
          >
            <Text style={styles.buttonOutlineText}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonSignIn}
          >
            <Text style={styles.buttonText}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  )
}

export default LoginScreen

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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  nrmlButtonContainer: {
    flexDirection: 'row',
  },
  buttonSignIn: {
    backgroundColor: 'blue',
    width: '40%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSignUp: {
    backgroundColor: 'white',
    width: '40%',
    padding: 15,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 1,
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

  socialButtonContainer: {
    // width: '100%',
    marginTop: 30,
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
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
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    color: '#333',
  },

})
import 'react-native-gesture-handler';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,} from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { setDoc, doc } from "firebase/firestore";

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [modalAlert, setModalAlert] = useState(false)

  const emailRgex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const navigation = useNavigation()

  const [modalMsg, setModalMsg] = useState('')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Projects")
      }
    })
    return unsubscribe;
  }, [])

  const handleLogin = () => {
    if(emailRgex.test(email)) {
      if (password.length > 5) {
        signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
      })
      .catch(error => alert(error.message))
      }
      else {
        setModalMsg('Your password should be at least 6 charachters! Try again!')
        setModalAlert(true)
      }
    }
    else {
      setModalMsg('You email address is not valid! Try again!')
      setModalAlert(true)
    }
  }

  const handleSignUp = () => {
    if(emailRgex.test(email)) {
      if (password.length > 5) {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
        const user = userCredentials.user;
        createUserFirestore(user.uid)
        })
        .catch(error => alert(error.message))
      }
      else {
        setModalMsg('Your password should be at least 6 charachters! Try again!')
        setModalAlert(true)
      }
    }
    else {
      setModalMsg('You email address is not valid! Try again!')
      setModalAlert(true)
    }
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
        onChangeText={text => setEmail(text.trim())}
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


      {/* Alert modal email */}
      <Modal style={styles.modalContainer}
      animationType="none"
      transparent={true}
      visible={modalAlert}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.Title}>Warning</Text>
            <Text>{modalMsg}</Text>
            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => setModalAlert(false)}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>




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

    // Alert modals
    modalContent:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width: '80%',
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    btnModalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    btnModal: {
      borderWidth: 1,
      padding: 10,
    },
    Title: {
      marginBottom: 10,
      fontSize: 20,
      color: '#333',
    },

})
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import {Ionicons, MaterialIcons} from '@expo/vector-icons';

const AccountScreen = () => {

  const [userName, setUserName] = useState('')
  const [userNameModal, setUserNameModal] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [email, setEmail] = useState('')

  const [modalUsernameVisible, setModalUsernameVisible] = useState(false)

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
      displayName:userNameModal
    }); 
    getCurrentUser()
    setModalUsernameVisible(false)
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
    <View style={styles.container}>

      <View style={styles.imageContainer}>
      <Image source={require('../assets/User-pic.jpg')}style={styles.image}/>
      </View>

      <View style={styles.headerInfoContainer}>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>{userName}</Text>
          <TouchableOpacity
          onPress={() => setModalUsernameVisible(true)}
          >
            <Ionicons name="ios-create-outline" size={15}/>
          </TouchableOpacity>
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>{email}</Text>
          {/* <TouchableOpacity>
            <Ionicons name="ios-create-outline" size={15}/>
          </TouchableOpacity> */}
        </View>
      </View>

      
        <Modal style={styles.modal}
        transparent={true}
        animationType="slide"
        visible={modalUsernameVisible}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalView}>
            <TextInput
            placeholder="New username..."
            onChangeText={text => setUserNameModal(text)}
            style={styles.inputText}
            ></TextInput>

            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => setModalUsernameVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => updateUsername()}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </Modal>
      

    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
  },

  // Image styling
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginVertical: 20,
  },

  // Username styling
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  usernameText: {
    // marginRight: 10,
  },

  // Email styling


  // MODAL username
  // Username input
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
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
  inputText: {
    backgroundColor: '#f2f3f3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnModal: {
    borderWidth: 1,
    padding: 10,
  },

})
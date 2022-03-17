import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Pressable, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {Picker} from '@react-native-picker/picker';

const ProjectScreen = () => {

  const [currentUser, setCurrentUser] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectCategory, setProjectCategory] = useState()
  const [projectStatus, setProjectStatus] = useState('')
  const [projectCompletion, setProjectCompletion] = useState('')

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

  async function createProject() {
    
    const newProject = await addDoc(collection(db, "Projects"), {
      ownerId: currentUser.uid,
      name: projectName,
      description: projectDescription,
      isDeleted: false,
      category: projectCategory,
      steps: [],
      status: "To Do",
      Deadline: "",
      Completion: 0,

    });
    setModalVisible(false)

  }


  return (

    <View style={styles.container}>

      <Modal visible={modalVisible}>
        <View style={styles.modalContent}>

          <View>
            <View>
              <Text>Project name</Text>
              <TextInput
              placeholder="Name..."
              value={projectName}
              onChangeText={text => setProjectName(text)}
              style={styles.input}
              ></TextInput>
            </View>

            <View>
              <Text>Project description</Text>
              <TextInput
              placeholder="Description..."
              value={projectDescription}
              onChangeText={text => setProjectDescription(text)}
              style={styles.input}
              ></TextInput>
            </View>

            <View>
              <Text>Category</Text>
              <Picker
              selectedValue={projectCategory}
              onValueChange={(itemValue, itemIndex) => setProjectCategory(itemValue)}
              >
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="School" value="School" />
              <Picker.Item label="Work" value="Work" />
              </Picker>
            </View>
          </View>
          

          
          <View style={styles.btnContainer}>
          <Button
            onPress={() => createProject()}
            >
              <Text>Add Project</Text>
            </Button>
            <Button
            onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </Button>
          </View>

        </View>
      </Modal>

      <FAB
        style={styles.fab}
        medium
        icon="plus"
        color="white"
        theme={{ colors: { accent: '#1a75ff' } }}
        onPress={() => setModalVisible(true)}
      />
    </View>
    
  )
}

export default ProjectScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

})
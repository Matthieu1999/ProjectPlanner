import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Pressable, Modal, FlatList, TextInput, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
import {MaterialIcons} from '@expo/vector-icons'

const ProjectScreen = () => {

  const [currentUser, setCurrentUser] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectCategory, setProjectCategory] = useState('Personal')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectCompletion, setProjectCompletion] = useState('')
  const [projectColor, setProjectColor] = useState('')

  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const loggedUserId = user.uid
        // getCurrentUser()
        setCurrentUser(loggedUserId);
        readProject()
      }
    });

  }, [])

  // async function getCurrentUser() {
  //   if (auth.currentUser !== null) {
  //     setCurrentUser(auth.currentUser);
  //   }
  // }

  async function createProject() {

    const newProject = await addDoc(collection(db, "Projects"), {
      ownerId: currentUser,
      projectName: projectName,
      projectDescription: projectDescription,
      isDeleted: false,
      projectCategory: projectCategory,
      projectSteps: [],
      projectStatus: "To Do",
      projectDeadline: "",
      projectCompletion: 0,
      projectColor: projectColor,

    });
    setModalVisible(false)
    setProjectName("")
    setProjectDescription("")
    readProject()
  }

  async function readProject() {

    const getAllProjects = [];
    const q = query(collection(db, "Projects"), where("ownerId", "==", currentUser), where("isDeleted", "==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    getAllProjects.push({ ...doc.data(), key: doc.id });
    });
    setAllProjects(getAllProjects);
  }

  // async function deleteProject() {

  //   await updateDoc(doc(db, "Projects", email), {
  //     isDeleted:true,
  //   }); 
  // }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item}
      backgroundColor="">
        <View style={styles.projectUpper}>
          <Text>{item.projectName}</Text>
          <Text>{item.projectStatus}</Text>
        </View>
        <View style={styles.projectUnder}>
          <Text>{item.projectCompletion}%</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemRight}>
      <MaterialIcons style={styles.icon} name="delete"/>
      </TouchableOpacity>
    </View>
  );

  return (

    <View style={styles.container}>

      <SafeAreaView style={styles.project}>
        <FlatList
        data={allProjects}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        />
      </SafeAreaView>


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


  projectContainer: {
    flex: 1,
  },



  // Firestore database read styles

  itemContainer: {
    flex: 1,
    flexDirection: "row",
  },
  item: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
    marginVertical: 2,
    marginLeft: 10,
  },
  itemRight: {
    backgroundColor: '#ffb3b3',
    width: "10%",
    marginVertical: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 10,
    borderLeftWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  projectUpper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectUnder: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
  },

  icon: {
    fontSize: 25,
    color: '#333',
    flexDirection: "column",
  },

})
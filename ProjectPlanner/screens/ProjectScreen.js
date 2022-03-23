import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Pressable, Modal, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
import {MaterialIcons} from '@expo/vector-icons';



const ProjectScreen = () => {

  const [currentUser, setCurrentUser] = useState(null)

  const [modalCreateVisible, setModalCreateVisible] = useState(false)
  const [modalProjectVisible, setModalProjectVisible] = useState(false)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectCategory, setProjectCategory] = useState('Personal')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectCompletion, setProjectCompletion] = useState('')
  const [projectColor, setProjectColor] = useState('')

  const [allProjects, setAllProjects] = useState([]);

  const [date, setDate] = useState(new Date())

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
    setModalCreateVisible(false)
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

  async function readProjectPressed () {

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
          <Text style={styles.projectStatus}>{item.projectStatus}</Text>
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
        ListFooterComponent={<View style={{ flexGrow: 1, justifyContent: 'flex-end', marginTop: 80, }}/>}
        style={styles.projectList}
        data={allProjects}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        />
      </SafeAreaView>


      <Modal style={styles.modalContainer}
      animationType="slide"
      visible={modalCreateVisible}
      >
        <View style={styles.modalView}>

          <View style={styles.completeView}>
            <View style={styles.fieldViewOfModal}>
              <Text style={styles.modalText}>Project name</Text>
              <TextInput
              placeholder="Name..."
              value={projectName}
              onChangeText={text => setProjectName(text)}
              style={styles.inputText}
              ></TextInput>
            </View>

            <View style={styles.fieldViewOfModal}>
              <Text style={styles.modalText}>Project description</Text>
              <TextInput
              multiline
              numberOfLines={8}
              placeholder="Description..."
              value={projectDescription}
              onChangeText={text => setProjectDescription(text)}
              style={styles.inputText}
              ></TextInput>
            </View>

            <View style={styles.fieldViewOfModal}>
              <Text style={styles.modalText}>Category</Text>
              <Picker
              style={styles.picker}
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
            onPress={() => setModalCreateVisible(false)}
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
        onPress={() => setModalCreateVisible(true)}
      /> 
    </View>
    
  )
}

export default ProjectScreen

const styles = StyleSheet.create({

  // Page content
  container: {
    flex: 1,
  },

  // Modal content
  modalContainer: {
    flex: 1,
    alignSelf: "center",
  },
  fieldViewOfModal: {
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  inputText: {
    backgroundColor: '#f2f3f3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  picker: {
    width: '50%',
    alignContent: "center",
  },

  projectContainer: {
    flex: 1,
  },

  projectList: {
    // marginBottom: 80,
  },

  // FAB styling
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
  projectStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    color: "#cc0000",
    borderColor: '#cc0000',
    borderWidth: 2,
  },

  icon: {
    fontSize: 25,
    color: '#333',
    flexDirection: "column",
  },

})
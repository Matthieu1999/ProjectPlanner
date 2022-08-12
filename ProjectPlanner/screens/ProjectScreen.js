import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Alert, Modal, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';


const ProjectScreen = () => {

  const [currentUser, setCurrentUser] = useState(null)

  // NAVIGATION
  const navigation = useNavigation()

  // MODAL VISIBILITY STATE
  const [modalCreateVisible, setModalCreateVisible] = useState(false)

  // PROJECT VALUES
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectCategory, setProjectCategory] = useState('Personal')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectCompletion, setProjectCompletion] = useState('')
  const [projectDeadline, setProjectDeadline] = useState(new Date())

  // ARRAYS FOR READS FROM FIRESTORE
  const [allProjects, setAllProjects] = useState([]);

  // NOT USED YET
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        getCurrentUser()
      }
    });
  }, [])

  async function getCurrentUser() {
    if (auth.currentUser !== null) {
      setCurrentUser(auth.currentUser.uid);
      readProject(auth.currentUser.uid)
    }
  }

  async function createProject() {
    let color = ""
    if(projectCategory === 'Personal') {
      color = '#cce6ff'
    } 
    if (projectCategory === 'Work') {
      color = '#ffe0cc'
    }
    if (projectCategory === 'School') {
      color = '#e6ffe6'
    }
    
    const newProject = await addDoc(collection(db, "Projects"), {
      ownerId: currentUser,
      projectName: projectName,
      projectDescription: projectDescription,
      isDeleted: false,
      projectCategory: projectCategory,
      projectCategoryColor: color,
      projectSteps: [],
      projectStatus: "Todo",
      projectDeadline: "",
      projectCompletion: 0,
    });
    setModalCreateVisible(false)
    setProjectName("")
    setProjectDescription("")
    getCurrentUser()
  }


  async function readProject(uid) {
    const getAllProjects = [];
    const q = query(collection(db, "Projects"), where("ownerId", "==", uid), where("isDeleted", "==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    getAllProjects.push({ ...doc.data(), key: doc.id });
    });
    setAllProjects(getAllProjects);
  }


  const deleteAlert = (item) =>
    Alert.alert(
      "Delete Project?",
      "Are you sure you want to delete the project named '" + item.projectName + "'",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Confirm", onPress: () => deleteProject(item) }
      ]
    )

  async function deleteProject(item) {
    await updateDoc(doc(db, "Projects", item.key), {
      isDeleted:true,
    }); 
    getCurrentUser()
  }
  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={
        {flex: 1,
          backgroundColor: item.projectCategoryColor,
          borderRadius: 20,
          padding: 10,
          marginTop: 5,
          width: '80%',
          elevation: 2,
        }}
        onPress={() => navigation.navigate('CompleteProject', {Project: item})}
        onLongPress={() => deleteAlert(item)}
        >
        <View style={styles.projectUpper}>
          <Text>{item.projectName}</Text>
          <Text style={styles.projectStatus}>{item.projectStatus}</Text>
        </View>

        <View style={styles.projectUnder}>
          <Text>{item.projectCompletion}%</Text>
        </View>
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

      {/* Modal to create a project */}
      <Modal style={styles.modalContainer}
      animationType="slide"
      transparent={true}
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

            
            <View style={styles.fieldViewOfModal}>
              <Text style={styles.modalText}>Deadline</Text>
              <Text>Coming Soon</Text>
            </View>
          </View>
          
          <View style={styles.btnContainer}>
            <Button
            style={styles.btnModal}
            onPress={() => setModalCreateVisible(false)}
            >
              <Text style={styles.btnModalText}>Cancel</Text>
            </Button>
            <Button
            style={styles.btnModal}
            onPress={() => createProject()}
            >
              <Text style={styles.btnModalText}>Add Project</Text>
            </Button>
          </View>

        </View>
      </Modal>

      {/* FAB button to open the create project modal */}
      <FAB style={styles.fab}
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

  // Modal content project creation
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
  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  btnModal: {
    borderWidth: 1,
    borderColor: 'blue',
    margin: 10,
  },
  btnModalText: {
    color: 'blue',
  },

  projectContainer: {
    flex: 1,
  },

  projectList: {
    // marginBottom: 80,
  },


  // Modal to add new step
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
    width: '85%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  item: {
    // flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
    marginVertical: 2,
    marginLeft: 10,
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
    borderRadius: 5,
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
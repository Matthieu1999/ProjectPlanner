import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Alert, Modal, FlatList, List, TextInput, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import {MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';


const CompleteProjectScreen = () => {
    
    // Getting the project item from previous page (param)
    const route = useRoute()
    const { Project } = route.params;

    const navigation = useNavigation()

    const [currentUser, setCurrentUser] = useState(null)

  // MODAL VISIBILITY STATE
  const [modalAddStepVisible, setModalAddStepVisible] = useState(false)
  const [modalModifyStepVisible, setModalModifyStepVisible] = useState(false)

  // PROJECT VALUES
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectCompletion, setProjectCompletion] = useState('')
  const [projectDeadline, setProjectDeadline] = useState(new Date())

  // STEP VALUES
  const [stepName, setStepName] = useState('')
  const [stepStatus, setStepStatus] = useState('')
  const [stepDeadline, setStepDeadline] = useState(new Date())

  // ARRAYS FOR READS FROM FIRESTORE
  const [allSteps, setAllSteps] = useState([]);

  // NOT USED YET
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        getCurrentUser()
      }
    });
    navigation.setOptions({
        title: Project.projectName,
      });
  }, [])

  async function getCurrentUser() {
    if (auth.currentUser !== null) {
      setCurrentUser(auth.currentUser.uid);
      readCompleteProject()
      readAllSteps()
    }
  }
    

  async function createStep () {
    setModalAddStepVisible(false)
    const newStep = await addDoc(collection(db, "Projects", Project.key, "Steps"), {
      stepName: stepName,
      stepStatus: "Not Done",
      stepDeadline: "stepDeadline",
    });
    readAllSteps()
  }

  async function readCompleteProject() {
    
    setProjectName(Project.projectName)
    setProjectDescription(Project.projectDescription)
    setProjectStatus(Project.projectStatus)
  }

  async function readAllSteps () {
    const getAllSteps = [];
    const querySnapshot = await getDocs(collection(db, "Projects", Project.key, "Steps"));
    querySnapshot.forEach((doc) => {
    getAllSteps.push({ ...doc.data(), key: doc.id });
    });
    setAllSteps(getAllSteps);
  }

  const deleteAlert = (item) =>
    Alert.alert(
      "Modify / Delete?",
      "Modify or delete the step named '" + item.stepName + "'?",
      [
        {
            text: "Keep it",
            style: "cancel"
        },
        {
            text: "Modify", onPress: () => setModalModifyStepVisible(true)
        },
        { 
            text: "Delete", onPress: () => deleteStep(item) 
        }
      ]
    )

    async function deleteStep (item) {
        await deleteDoc(doc(db, "Projects", Project.key, "Steps", item.key ))
        readAllSteps()
    }

  const renderStep = ({ item }) => (
    
    <TouchableOpacity style={{
    elevation: 2,
    backgroundColor: '#f0f0f5',
    marginVertical: 10,
    padding: 15,
    color: "black",
    borderRadius: 25,
    }}
    onPress={() => {}}
    onLongPress={() => deleteAlert(item)}
    >
        <Text>
            {item.stepName}
        </Text>
    </TouchableOpacity> 
  )

    return (
        <View style={styles.container}>

      {/* Modal to add a new step to an existing project */}
      <Modal style={styles.modalContainer}
      animationType="slide"
      transparent={true}
      visible={modalAddStepVisible}
      >

        <View style={styles.modalContent}>
            <View style={styles.modalView}>
              <Text style={styles.Title}>Add a new step</Text>
              <TextInput
              placeholder="Step name..."
              onChangeText={text => setStepName(text)}
              style={styles.inputText}
              >
              </TextInput>

              <View style={styles.btnModalContainer}>
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setModalAddStepVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => createStep()}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      </Modal>

      {/* Modal modify a step */}
      <Modal style={styles.modalContainer}
      animationType="slide"
      transparent={true}
      visible={modalModifyStepVisible}
      >

        <View style={styles.modalContent}>
            <View style={styles.modalView}>
              <Text style={styles.Title}>Modify Step</Text>
              <TextInput
              text="New step name..."
              onChangeText={text => setStepName(text)}
              style={styles.inputText}
              >
              </TextInput>

              <View style={styles.btnModalContainer}>
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setModalModifyStepVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => modifyStep()}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      </Modal>

      {/* Modal modify the project description */}
      {/* <Modal style={styles.modalContainer}
      animationType="slide"
      transparent={true}
      visible={modalModifyStepVisible}
      >

        <View style={styles.modalContent}>
            <View style={styles.modalView}>
              <Text style={styles.Title}>Modify Step</Text>
              <TextInput
              text="New step name..."
              onChangeText={text => setStepName(text)}
              style={styles.inputText}
              >
              </TextInput>

              <View style={styles.btnModalContainer}>
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setModalAddStepVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => modifyStep()}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      </Modal> */}

      {/* Project Complete View */}
      
        <SafeAreaView>

            <ScrollView style={styles.viewCompleteProject}>

                <View style={styles.viewProjectContent}>

                    <View style={styles.viewProgress}>
                        {/* progress bar depending on the steps that are finished */}
                    </View>

                    <View style={styles.viewDeadline}>
                        <Text style={styles.projectDeadlineTitle}>Deadline</Text>
                    </View>

                    {/* DESCRIPTION */}
                    <View style={styles.viewElement}>

                        <View style={styles.specHeader}>
                            <Text style={styles.Title}>Description</Text>
                            <TouchableOpacity>
                                <Ionicons name="ios-create-outline" size={25}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.projectDescription} >{projectDescription}</Text>
                    </View>

                    {/* STEPS */}
                    <View style={styles.viewElement}>

                        <View style={styles.specHeader}>
                            <Text style={styles.Title}>Steps</Text>
                            <TouchableOpacity
                            onPress={() => setModalAddStepVisible(true)}
                            >
                                <Ionicons name="add-circle-outline" size={25}/>
                            </TouchableOpacity>
                        </View>

                        {/* <SafeAreaView style={styles.step}> */}
                            <FlatList
                            style={styles.stepList}
                            data={allSteps}
                            renderItem={renderStep}
                            keyExtractor={item => item.key}
                            />
                        {/* </SafeAreaView> */}
                    </View>

                    {/* COMMENTS */}
                    <View style={styles.viewComments}>
                        <Text style={styles.projectCommentsTitle}>Comments</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    </View>
    )

}

export default CompleteProjectScreen

const styles = StyleSheet.create({

    // Page content
    container: {
      flex: 1,
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
  

    // Complete view of single project (modal)
    viewCompleteProject: {
      flexDirection: "column",
      // alignSelf: "center",
    },

    viewTitleStatus: {
      // flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 20,
      backgroundColor: "#EEEEEE",
    },
    projectName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
  
    viewProjectContent: {
      // width: '80%',
      paddingHorizontal: 20,
    },
    viewProgress: {
  
    },
    viewDeadline: {
  
    },
  
    viewElement: {
      elevation: 2,
      backgroundColor: '#FFF',
      marginVertical: 10,
      padding: 15,
      borderRadius: 25,
    },
    specHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    Title: {
      marginBottom: 10,
      fontSize: 20,
      color: '#333',
    },
    projectDescription: {
    },
  
  
    viewComments: {
      alignItems: "center",
      elevation: 2,
      backgroundColor: '#FFF',
      marginVertical: 10,
      padding: 15,
      borderRadius: 25,
    },
  
  
  })
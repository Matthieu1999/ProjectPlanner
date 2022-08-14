import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Alert, Modal, FlatList, List, TextInput, 
  SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ListItem } from 'react-native-elements'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import {MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress';


const CompleteProjectScreen = () => {
    
    // Getting the project item from previous page (param)
    const route = useRoute()
    const { Project } = route.params;

    const navigation = useNavigation()

    const [currentUser, setCurrentUser] = useState(null)

  // MODAL VISIBILITY STATE
  const [modalAddStepVisible, setModalAddStepVisible] = useState(false)
  const [modalModifyStepVisible, setModalModifyStepVisible] = useState(false)
  const [modalModifyDescriptionVisible, setModalModifyDescriptionVisible] = useState(false)

  const [modalAlertStep, setModalAlertStep] = useState(false)
  const [modalAlertStepModify, setModalAlertStepModify] = useState(false)

  const [modalAlertDesc, setModalAlertDesc] = useState(false)

  // PROJECT VALUES
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectDeadline, setProjectDeadline] = useState("")

  const [modProjDesc, setModProjDesc] = useState('')

  // STEP VALUES
  const [stepName, setStepName] = useState('')

  const [step, setStep] = useState({})

  const [percentSteps, setPercentSteps] = useState(0)

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
    
  async function readCompleteProject() {
    
    setProjectName(Project.projectName)
    setProjectDescription(Project.projectDescription)
    setProjectStatus(Project.projectStatus)

    
    setProjectDeadline(Project.projectDeadline)
  }

  async function createStep () {
    if (stepName < 1) {
      setModalAlertStep(true)
      setModalAddStepVisible(false)
    }
    else {
    setModalAddStepVisible(false)
    const newStep = await addDoc(collection(db, "Projects", Project.key, "Steps"), {
      stepName: stepName,
      stepDeadline: "stepDeadline",
      isChecked: false,
    });
    readAllSteps()
    }
  }

  async function readAllSteps () {
    const getAllSteps = [];
    const querySnapshot = await getDocs(collection(db, "Projects", Project.key, "Steps"));
    querySnapshot.forEach((doc) => {
    getAllSteps.push({ ...doc.data(), key: doc.id });
    });
    setAllSteps(getAllSteps);
    progressionCount()
  }

  function funcToModifyStep (item) {
    setModalModifyStepVisible(true)
    setStepName(item.stepName)
    setStep(item)
  }

  async function modifyStep () {

    if (stepName < 1) {
      setModalAlertStepModify(true)
      setModalModifyStepVisible(false)
    }
    else {
      await updateDoc(doc(db, "Projects", Project.key, "Steps", step.key), {
        stepName: stepName,
      });
      setModalModifyStepVisible(false)
      readAllSteps()
    }    
  }

  async function modifyDescription() {
    if (modProjDesc < 1) {
      setModalAlertDesc(true)
      setModalModifyDescriptionVisible(false)
    }
    else {
      await updateDoc(doc(db, "Projects", Project.key), {
        projectDescription: modProjDesc,
      });
      setModalModifyDescriptionVisible(false)
      setProjectDescription(modProjDesc)
    }
  }

  const deleteAlert = (item) =>
    Alert.alert(
      "Modify / Delete?",
      "Modify or delete the step named '" + item.stepName + "'?",
      [{ text: "Cancel", style: "cancel"},
        {text: "Modify", onPress: () => funcToModifyStep(item)},
        { text: "Delete", onPress: () => deleteStep(item)}]
    )

  async function deleteStep (item) {
    await deleteDoc(doc(db, "Projects", Project.key, "Steps", item.key ))
    readAllSteps()
  }

  
  async function checkStep(item) {
      if (item.isChecked == false) {
        await updateDoc(doc(db, "Projects", Project.key, "Steps", item.key), {
          isChecked: true,
        });
      }
      if (item.isChecked == true) {
        await updateDoc(doc(db, "Projects", Project.key, "Steps", item.key), {
          isChecked: false,
        });
      }
      readAllSteps()
  }

  async function progressionCount() {
    const getCheckedSteps = query(collection(db, "Projects", Project.key, "Steps"), where("isChecked", "==", true));
    const checkedStepsResult = await getDocs(getCheckedSteps);
    const getSteps = await getDocs(collection(db, "Projects", Project.key, "Steps"))
    if (getSteps.size == 0) {}
    else {
      setPercentSteps(Number((checkedStepsResult.size/getSteps.size).toFixed(2)))
      await updateDoc(doc(db, "Projects", Project.key), {
        projectCompletion: Math.round((checkedStepsResult.size/getSteps.size)*100),
      });
    }   
  }

    return (
        <View style={styles.container}>

      {/* Modal to add a new step to an existing project */}
      <Modal style={styles.modalContainer}
      animationType="none"
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
      animationType="none"
      transparent={true}
      visible={modalModifyStepVisible}
      >

        <View style={styles.modalContent}>
            <View style={styles.modalView}>
              <Text style={styles.Title}>Modify Step</Text>
              <TextInput
              value={stepName}
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
      <Modal style={styles.modalContainer}
      animationType="none"
      transparent={true}
      visible={modalModifyDescriptionVisible}
      >

        <View style={styles.modalContent}>
            <View style={styles.modalView}>
              <Text style={styles.Title}>Modify Description</Text>
              <TextInput
              multiline
              numberOfLines={8}
              value={modProjDesc}
              onChangeText={text => setModProjDesc(text)}
              style={styles.inputText}
              >
              </TextInput>

              <View style={styles.btnModalContainer}>
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setModalModifyDescriptionVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              
                <TouchableOpacity
                style={styles.btnModal}
                onPress={() => modifyDescription()}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      </Modal>

      {/* Modal alert add new step name */}
      <Modal style={styles.modalContainer}
      animationType="none"
      transparent={true}
      visible={modalAlertStep}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.Title}>Warning</Text>
            <Text>Step name cannot be empty!</Text>
            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => [setModalAlertStep(false), setModalAddStepVisible(true)]}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal alert modify step name */}
      <Modal style={styles.modalContainer}
      animationType="none"
      transparent={true}
      visible={modalAlertStepModify}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.Title}>Warning</Text>
            <Text>Step name cannot be empty!</Text>
            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => [setModalAlertStepModify(false), setModalModifyStepVisible(true)]}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal ALert project DESCRIPTION */}
      <Modal style={styles.modalContainer}
      animationType="none"
      transparent={true}
      visible={modalAlertDesc}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.Title}>Warning</Text>
            <Text>Project description cannot be empty!</Text>
            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => [setModalAlertDesc(false), setModalModifyDescriptionVisible(true)]}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Project Complete View */}
        <SafeAreaView>

            <ScrollView style={styles.viewCompleteProject}>

                <View style={styles.viewProjectContent}>


                    {/* PROJECT DETAILS => deadline, status, percent and progress bar */}
                    <View style={styles.viewElement}>
                      <View style={styles.specHeader}>
                        <Text style={styles.Title}>Project Details</Text>
                      </View>
                        
                        <View style={styles.projectDetailsView}>
                          <View style={styles.detailsElement}>
                            <Text style={styles.detailsElementTitle}>Deadline</Text>
                            <Text style={styles.detailsElementItem}>{projectDeadline}</Text>
                          </View>

                          <View style={styles.detailsElement}>
                            <Text style={styles.detailsElementTitle}>Progress</Text>
                            <Progress.Circle style={styles.detailsProgress}
                            showsText={true}
                            progress={percentSteps}
                            size={100}
                            indeterminate={false}
                            animated={false}
                            />
                            
                          </View>
                        </View>
                    </View>

                    {/* DESCRIPTION */}
                    <View style={styles.viewElement}>

                        <View style={styles.specHeader}>
                            <Text style={styles.Title}>Description</Text>
                            <TouchableOpacity
                            onPress={() => [setModalModifyDescriptionVisible(true), setModProjDesc(projectDescription)]}
                            >
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
                            {
                              allSteps.map((item) => ( 
                                <ListItem
                                component={TouchableOpacity}
                                underlayColor="transparent"
                                containerStyle={{
                                padding: 10,
                                marginVertical: 5,
                                backgroundColor: item.isChecked ?  'green' : '#f0f0f5',
                                borderRadius:10,
                                }}
                                
                                onPress={() => checkStep(item)}
                                onLongPress={() => deleteAlert(item)}
                                key = {item.key}
                                // title = {item.stepName}
                                bottomDivider
                                >
                                <Text>{item.stepName}</Text>
                                </ListItem>
                              ))
                            }
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
    },

    viewProjectContent: {
      paddingHorizontal: 20,
    },

    projectDetailsView: {
      flexDirection: 'row',
      justifyContent:'space-around',
    },
    detailsElement: {
      textAlign: 'center',
    },
    detailsElementTitle: {
      textAlign: 'center',
      marginBottom: 10,
    },
    detailsProgress: {
    },

    viewProgress: {
  
    },
    viewDeadline: {
  
    },
  
    stepList: {

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
  
  })
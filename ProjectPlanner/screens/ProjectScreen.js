import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Alert, Modal, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { Component, useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';

import DatePicker from 'react-native-modern-datepicker';
import { ScrollView } from 'react-native-gesture-handler';


const ProjectScreen = () => {

  const [currentUser, setCurrentUser] = useState(null)

  // NAVIGATION
  const navigation = useNavigation()

  // MODAL VISIBILITY STATE
  const [modalCreateVisible, setModalCreateVisible] = useState(false)
  const [modalDateVisible, setModalDateVisible] = useState(false)

  // ALERT MODALS
  const [modalAlertName, setModalAlertName] = useState(false)
  const [modalAlertDesc, setModalAlertDesc] = useState(false)

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
  const [date, setDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)


  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user !== null) {
          getCurrentUser()
        }
      });

      let today = new Date();
      if (today.getMonth()+1 < 10) {
        setDate(today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate())
        setSelectedDate(today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate())
      }
      else {
        setDate(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
        setSelectedDate(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
      }
      

      const unsubscribe = navigation.addListener('focus', () => {
        getCurrentUser()
      });
      return unsubscribe;
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

    // console.log(date)

    if (projectName.length < 1 || projectName.length > 30) {
      setModalAlertName(true)
      setSelectedDate(date)
    }
    else if (projectDescription < 1) {
      setModalAlertDesc(true)
    }
    else {
      await addDoc(collection(db, "Projects"), {
        ownerId: currentUser,
        projectName: projectName,
        projectDescription: projectDescription,
        isDeleted: false,
        projectCategory: projectCategory,
        projectCategoryColor: color,
        projectSteps: [],
        projectStatus: "Todo",
        projectDeadline: selectedDate,
        projectCompletion: 0,
      });
      setModalCreateVisible(false)
      setProjectName("")
      setProjectDescription("")
      await getCurrentUser()
    }
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
      "Are you sure you want to delete the project named '" + item.projectName + "'?",
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

      {/* PROJECTS FLATLIST */}
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
      <Modal style={styles.modal}
      animationType="slide"
      transparent={true}
      visible={modalCreateVisible}
      >
        <View style={styles.modalFullView}>

          <View style={styles.completeUpperView}>
            <View style={styles.elementView}>
              <Text style={styles.modalTitle}>Project name</Text>
              <TextInput
              placeholder="Name..."
              value={projectName}
              onChangeText={text => setProjectName(text)}
              style={styles.inputText}
              ></TextInput>
            </View>

            <View style={styles.elementView}>
              <Text style={styles.modalTitle}>Project description</Text>
              <TextInput
              multiline
              numberOfLines={8}
              placeholder="Description..."
              value={projectDescription}
              onChangeText={text => setProjectDescription(text)}
              style={styles.inputText}
              ></TextInput>
            </View>

            <View style={styles.elementView}>
              <Text style={styles.modalTitle}>Category</Text>
              <Picker
              style={styles.modalPicker}
              selectedValue={projectCategory}
              onValueChange={(itemValue, itemIndex) => setProjectCategory(itemValue)}
              >
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="School" value="School" />
              <Picker.Item label="Work" value="Work" />
              </Picker>
            </View>

            
            <View style={styles.elementView}>
              <Text style={styles.modalTitle}>Deadline</Text>
              <TouchableOpacity style={styles.modalDatePicker}
              onPress={() => [setModalDateVisible(true), setModalCreateVisible(false)]}
              > 
                <Text 
                style={styles.modalDatePickerOpenBtn}
                >
                  Choose a deadline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          
          <View style={styles.btnContainer}>
            <Button
            style={styles.btn}
            onPress={() => setModalCreateVisible(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Button>
            <Button
            style={styles.btn}
            onPress={() => createProject()}
            >
              <Text style={styles.btnText}>Add Project</Text>
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal datepicker */}
      <Modal style={styles.modalDate}
      animationType="fade"
      transparent={true}
      visible={modalDateVisible}
      >
        <View style={styles.modalDateContent}>
        <DatePicker
              options={{
                backgroundColor: 'white',
                textHeaderColor: '#FFA25B',
                textDefaultColor: 'black',
                selectedTextColor: '#fff',
                mainColor: '#F4722B',
                textSecondaryColor: '#D6C7A1',
                borderColor: 'rgba(122, 146, 165, 0.1)',
                elevation: 2,
              }}
              minimumDate={date}
              current={date}
              selected={selectedDate}
              onSelectedChange={(newDate) => setSelectedDate(newDate)}
              mode="calendar"
              style={{ borderRadius: 10 }}
              />
              <TouchableOpacity
              style={styles.dateConfirmTouch}
              onPress={() => [setModalDateVisible(false), setModalCreateVisible(true)]}
              >
                <Text style={styles.dateConfirmTxt}>
                  Confirm Date
                </Text>
              </TouchableOpacity>
        </View>
      
      </Modal>

      {/* Modal alert project NAME */}
      <Modal style={styles.modalContainer}
      animationType="slide"
      transparent={true}
      visible={modalAlertName}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.Title}>Warning</Text>
            <Text>Project name should be at least 3 charachters and maximum 30 charachters!</Text>
            <View style={styles.btnModalContainer}>
              <TouchableOpacity
              style={styles.btnModal}
              onPress={() => setModalAlertName(false)}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal ALert project DESCRIPTION */}
      <Modal style={styles.modalContainer}
      animationType="slide"
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
              onPress={() => setModalAlertDesc(false)}
              >
                <Text>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB button to open the create project modal */}
      <FAB style={styles.fab}
      medium
      icon="plus"
      color="white"
      theme={{ colors: { accent: '#1a75ff' } }}
      onPress={() => [setModalCreateVisible(true), setSelectedDate(date)]}
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

  // Modal date picker
  modalDate: {
    width: "80%",
  },
  modalDateContent: {
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  dateConfirmTouch: {
    borderWidth: 1,
    borderRadius: 10
    
  },
  dateConfirmTxt: {
    padding: 10,

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

  // Modal content project creation
  modal: {
    height: '90%',
  },
  modalFullView: {
    // height: '90%',
    width: '90%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    fontSize: 18,
    alignSelf: 'center',
  },
  inputText: {
  backgroundColor: '#f2f3f3',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginBottom: 20,
  width: '100%',
  elevation: 1,
  },
  modalPicker: {
    width: '80%',
    alignSelf: 'center',
    elevation: 1,
    backgroundColor: '#f2f3f3',
    marginBottom: 20,
  },
  modalDatePicker: {
    alignSelf: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "purple",
  },
  modalDatePickerOpenBtn: {
    padding: 3,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    borderWidth: 1,
    borderColor: 'blue',
    margin: 10,
  },
  btnText: {
    color: 'blue',
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
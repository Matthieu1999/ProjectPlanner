import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Alert, Modal, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import { auth, db } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

import { Button, FAB } from 'react-native-paper';

import {Picker} from '@react-native-picker/picker';
import {MaterialIcons, AntDesign, Ionicons, Octicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const CompleteProjectScreen = () => {

    return (
        <View>
            
        </View>
    )

}

export default CompleteProjectScreen
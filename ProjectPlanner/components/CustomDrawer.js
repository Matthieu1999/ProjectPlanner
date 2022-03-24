import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import {Ionicons} from '@expo/vector-icons'

import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { onAuthStateChanged } from "firebase/auth";

import { useNavigation } from '@react-navigation/native'


export function CustomDrawer(props) {

    const navigation = useNavigation()

    const [userEmail, setUserEmail] = useState()

    const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            navigation.replace("Login")
          })
          .catch(error => alert(error.message))
      }

      useEffect(() => {

        onAuthStateChanged(auth, (user) => {
          if (user) {
            const loggedUserEmail = user.email
            setUserEmail(loggedUserEmail)
            
          }
        });
      }, [])

    return (
        <View style={styles.drawerView}>
            <DrawerContentScrollView 
            {...props} 
            style={styles.drawerContentScroll}
            contentContainerStyle={{backgroundColor: '#8200d6'}}
            >
                <ImageBackground source={require('../assets/menu-bg.jpeg')} 
                style={styles.imageBackground}
                >
                    <Image source={require('../assets/User-pic.jpg')}
                    style={styles.image}
                    />
                    <Text style={styles.text}>{userEmail}</Text>
                </ImageBackground>
                <View style={styles.drawerItemListView}>
                    <DrawerItemList {...props}/>
                </View>
                
            </DrawerContentScrollView>

            <View style={styles.drawerBottom}>

                <View>
                    <TouchableOpacity
                    style={styles.btnSignOut}
                    onPress={handleSignOut}
                    >
                        <View style={styles.signOut}>
                            <Ionicons name="exit-outline" size={22}/>
                            <Text style={{marginLeft: 10}}>Sign Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({

    drawerView: {
        flex: 1,
    },
    drawerContentScroll: {
        
    },
    imageBackground: {
        padding: 20,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        fontSize: 18,
    },
    drawerItemListView: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    drawerBottom: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    btnSignOut: {
        paddingVertical: 15,
    },
    signOut: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
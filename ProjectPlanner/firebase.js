// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS714WasuprZYO8-L-0zEwKdLKzbDObyo",
  authDomain: "projectplanner-48ae2.firebaseapp.com",
  projectId: "projectplanner-48ae2",
  storageBucket: "projectplanner-48ae2.appspot.com",
  messagingSenderId: "96878954669",
  appId: "1:96878954669:web:c7585ada16aa2995bb9e24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth(app);

export { auth, app, db };
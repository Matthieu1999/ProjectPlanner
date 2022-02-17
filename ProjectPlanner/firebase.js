// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQRrB0cBMSi7qgRasPuq_1bG1Wrs2DPw8",
  authDomain: "projectplanner-2da72.firebaseapp.com",
  projectId: "projectplanner-2da72",
  storageBucket: "projectplanner-2da72.appspot.com",
  messagingSenderId: "1010206875520",
  appId: "1:1010206875520:web:100278a5d9e2de8947ab65",
  measurementId: "G-5RSCXFW3TY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };
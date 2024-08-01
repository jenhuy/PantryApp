// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxre5r9i7Tcx5fZVJ5owds4qCmKsA79I8",
  authDomain: "hspantryapp-c5ea0.firebaseapp.com",
  projectId: "hspantryapp-c5ea0",
  storageBucket: "hspantryapp-c5ea0.appspot.com",
  messagingSenderId: "1022718122028",
  appId: "1:1022718122028:web:9c5dd5140033e0e9fa9989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyBw4URBl4Rd4cvAOMdYFT1nmCg8nCrTw",
  authDomain: "todo-app-ba4e7.firebaseapp.com",
  projectId: "todo-app-ba4e7",
  storageBucket: "todo-app-ba4e7.firebasestorage.app",
  messagingSenderId: "274953417503",
  appId: "1:274953417503:web:6fcb6a5238c5d6cd25f62a",
  measurementId: "G-LHPZBNG606"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);
const db = getFirestore(app);
export {auth,db};
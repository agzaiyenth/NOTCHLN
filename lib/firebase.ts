// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get } from "http";
import { getAuth } from "firebase/auth";
import  { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB-rHjFkQy6BgOqGVAtSgh9dNR6tD9PoQ",
  authDomain: "govdocslk.firebaseapp.com",
  projectId: "govdocslk",
  storageBucket: "govdocslk.firebasestorage.app",
  messagingSenderId: "503534313975",
  appId: "1:503534313975:web:e8580165793b77b5e04ef2",
  measurementId: "G-28FZ77Q1QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
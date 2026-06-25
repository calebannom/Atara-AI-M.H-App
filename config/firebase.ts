// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-QZ2myHWectP5BFJmouf_aU--FXRMwnE",
  authDomain: "atara-70f4d.firebaseapp.com",
  projectId: "atara-70f4d",
  storageBucket: "atara-70f4d.firebasestorage.app",
  messagingSenderId: "342842664326",
  appId: "1:342842664326:web:e2844c7f261c1c1beef807",
  measurementId: "G-WP77GXSN32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;

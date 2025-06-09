// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX-Y0w0-54W-jhkAwnPlCgmJhZ208AT7o",
  authDomain: "pj-noacorporation-db.firebaseapp.com",
  projectId: "pj-noacorporation-db",
  storageBucket: "pj-noacorporation-db.firebasestorage.app",
  messagingSenderId: "523866479741",
  appId: "1:523866479741:web:1483a89ab0faf58e47e514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

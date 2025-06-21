// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAob9_MU-JpClXl-rOGFgJz0Ead0mB9CUU",
  authDomain: "pj-noacorporation-db.firebaseapp.com",
  projectId: "pj-noacorporation-db",
  storageBucket: "pj-noacorporation-db.firebasestorage.app",
  messagingSenderId: "523866479741",
  appId: "1:523866479741:web:1483a89ab0faf58e47e514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase初期化完了:", app.name);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
console.log("Firebase services初期化完了");

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// need to run: npm install --save firebase
// We will use the JS SDK with React Native

const firebaseConfig = {
  apiKey: "AIzaSyAoYTtwPgKF5qZQ6ydHR_w9zU0mmYlZmBs",
  authDomain: "mobilefinalmajorproject.firebaseapp.com",
  projectId: "mobilefinalmajorproject",
  storageBucket: "mobilefinalmajorproject.appspot.com",
  messagingSenderId: "653522670180",
  appId: "1:653522670180:web:05833942887cf321360571",
  measurementId: "G-D6WVDPSVEE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };

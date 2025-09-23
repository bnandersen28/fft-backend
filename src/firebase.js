// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCirvA7Ue1jDu87wcIR1z-TyI6N9yP2MGE",
  authDomain: "fft-allergen-check.firebaseapp.com",
  projectId: "fft-allergen-check",
  storageBucket: "fft-allergen-check.appspot.com",
  messagingSenderId: "1063044288878",
  appId: "1:1063044288878:web:daa113691b191a7a39717f",
  measurementId: "G-PE1JPLJX19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db, doc, getDoc };
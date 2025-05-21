// src/firebase/firebaseInit.js
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'


const firebaseConfig = {
  apiKey: "AIzaSyCAgtejs6O1L6WreOUtgnSvi6JkyB2lZUQ",
  authDomain: "arizasud-72eb5.firebaseapp.com",
  projectId: "arizasud-72eb5",
  storageBucket: "arizasud-72eb5.firebasestorage.app",
  messagingSenderId: "995853017727",
  appId: "1:995853017727:web:5758618f519eeeba58d54a",
  measurementId: "G-E18250Y52J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)
export { messaging, getToken, onMessage }

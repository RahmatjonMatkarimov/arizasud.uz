importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyCAgtejs6O1L6WreOUtgnSvi6JkyB2lZUQ",
  authDomain: "arizasud-72eb5.firebaseapp.com",
  projectId: "arizasud-72eb5",
  storageBucket: "arizasud-72eb5.firebasestorage.app",
  messagingSenderId: "995853017727",
  appId: "1:995853017727:web:5758618f519eeeba58d54a",
  measurementId: "G-E18250Y52J"
};

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

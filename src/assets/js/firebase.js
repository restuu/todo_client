import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBWGhAue91_KhMSD4XET10L48cr6ROBZAA",
  authDomain: "todo-fancy-4c973.firebaseapp.com",
  databaseURL: "https://todo-fancy-4c973.firebaseio.com",
  projectId: "todo-fancy-4c973",
  storageBucket: "todo-fancy-4c973.appspot.com",
  messagingSenderId: "190127370129"
};
firebase.initializeApp(config)

const providerFB = new firebase.auth.FacebookAuthProvider()
providerFB.addScope('email')

export { firebase, providerFB }
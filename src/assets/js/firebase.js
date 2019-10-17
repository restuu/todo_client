import firebase from 'firebase'

// todo fancy config
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
};
firebase.initializeApp(config)

const providerFB = new firebase.auth.FacebookAuthProvider()
providerFB.addScope('email')

export { firebase, providerFB }

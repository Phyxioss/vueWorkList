//firebase
import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAK0tEuf5hlFDEv5dHvorrbootRjDpTvcs",
    authDomain: "todos-14f28.firebaseapp.com",
    databaseURL: "https://todos-14f28.firebaseio.com",
    projectId: "todos-14f28",
    storageBucket: "todos-14f28.appspot.com",
    messagingSenderId: "14126625798",
    appId: "1:14126625798:web:3bfdbc823c2be65911bf87",
    measurementId: "G-ZWB1VXQ9GM"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const firestore = firebaseApp.firestore()
  firestore.settings({ timestampsInSnapshots: true })

  export default firestore
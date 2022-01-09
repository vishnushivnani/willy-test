import * as firebase from 'firebase'
require('@firebase/firestore')
const firebaseConfig = {
  apiKey: "AIzaSyC7fkl72h9ekr1h71ygJKGq8PjOG7938IQ",
  authDomain: "wily-app-29be3.firebaseapp.com",
  databaseURL: "https://wily-app-29be3-default-rtdb.firebaseio.com",
  projectId: "wily-app-29be3",
  storageBucket: "wily-app-29be3.appspot.com",
  messagingSenderId: "750975628590",
  appId: "1:750975628590:web:a8cf75357aed43710576bf"
};
firebase.initializeApp(firebaseConfig)
 export default firebase.firestore()

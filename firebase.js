import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyDo_P9anhjj7L0VW-2lOMD44qmrl7MiXM8",
    authDomain: "whatsapp-clone-c559a.firebaseapp.com",
    projectId: "whatsapp-clone-c559a",
    storageBucket: "whatsapp-clone-c559a.appspot.com",
    messagingSenderId: "539794726555",
    appId: "1:539794726555:web:d6008b9aa3fa6c39ecf03e",
    measurementId: "G-4NXH09YF9F"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = firebase.firestore();
// const storage = firebase.storage();
const auth = firebase.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export {auth, googleAuthProvider}
export default db
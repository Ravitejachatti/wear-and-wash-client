import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; // Firestore for storing additional user details

const firebaseConfig = {
  apiKey: "YAIzaSyCXrEvIkmvDvLC6f2zhzV2uREHpksR9u28",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "wearnwash-15bff.firebasestorage.app",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
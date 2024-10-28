// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration object (you can find this in your Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyCWzoPFTl-edN-ud3hXfBrzK33KcqVsDhY",
    authDomain: "wearnwash-95e48.firebaseapp.com",
    databaseURL:
      "https://wearnwash-95e48-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wearnwash-95e48",       
    storageBucket: "wearnwash-95e48.appspot.com",
    messagingSenderId: "101431081714",
    appId: "1:101431081714:web:3f501ba6c24428a8ed2e6b",
    measurementId: "G-1F3XCEVHER",
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export the Firebase Realtime Database
const database = getDatabase(app);
export { database };

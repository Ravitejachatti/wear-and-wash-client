// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration object (you can find this in your Firebase console)
const firebaseConfig = {
    apiKey: "your api key",
    authDomain: "auth domain",
    databaseURL:
      "datebase url",
    projectId: "your project id",       
    storageBucket: "y",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export the Firebase Realtime Database
const database = getDatabase(app);
export { database };

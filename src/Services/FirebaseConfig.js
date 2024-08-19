
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";






const firebaseConfig = {
  apiKey: "AIzaSyAFktsglT4YeWLlIlf9KC5vZ3I8xO2KPdM",
  authDomain: "interativelist.firebaseapp.com",
  projectId: "interativelist",
  storageBucket: "interativelist.appspot.com",
  messagingSenderId: "450833918666",
  appId: "1:450833918666:web:7ce7769337acd0b8a02233",
  measurementId: "G-M2LBVKW3HT",
  databaseURL: "https://interativelist-default-rtdb.firebaseio.com"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
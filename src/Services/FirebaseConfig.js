// src/Services/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAFktsglT4YeWLlIlf9KC5vZ3I8xO2KPdM',
  authDomain: 'interativelist.firebaseapp.com',
  projectId: 'interativelist',
  storageBucket: 'interativelist.appspot.com',
  messagingSenderId: '450833918666',
  appId: '1:450833918666:web:7ce7769337acd0b8a02233',
  measurementId: 'G-M2LBVKW3HT',
  databaseURL: 'https://interativelist-default-rtdb.firebaseio.com',
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Configure a persistência do Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };

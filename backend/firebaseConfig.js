// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getDocs, addDoc, collection } = require('firebase/firestore');

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAVMoEBW33ggbXEHI-rPhRVrMm2o9i2PZk",
    authDomain: "rule-engine-f9838.firebaseapp.com",
    projectId: "rule-engine-f9838",
    storageBucket: "rule-engine-f9838.appspot.com",
    messagingSenderId: "205902951138",
    appId: "1:205902951138:web:339ace0e0b990c15e6a4bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;

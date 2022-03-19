import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCkqg09jYsHpXPaWv8EHFnbhM1cSW3euUc",
  authDomain: "planless-test.firebaseapp.com",
  databaseUrl: "https://planless-test-default-rtdb.firebaseio.com/",
  projectId: "planless-test",
  storageBucket: "planless-test.appspot.com",
  messagingSenderId: "450078651287",
  appId: "1:450078651287:web:bea0421c119b841e114ad2",
  measurementId: "G-Q4TV9KV3YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app)

export default db;
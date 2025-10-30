import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjCuV6wOoPquE7b1ACn48hiHgOVHSjAkg",
  authDomain: "todoapp.firebaseapp.com",
  projectId: "todoapp-adc5e",
  storageBucket: "todoapp-adc5e.firebasestorage.app",
  messagingSenderId: "878638099277",
  appId: "1:878638099277:android:272b986318030bd66ce504"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
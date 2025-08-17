import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAAnZw9FhMc4iVfGro1buLVCVvC8Cyd2Q",
  authDomain: "global-plate-dev.firebaseapp.com",
  projectId: "global-plate-dev",
  storageBucket: "global-plate-dev.firebasestorage.app",
  messagingSenderId: "1021496007378",
  appId: "1:1021496007378:web:4770893cb90e9125952b0b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: This configuration object must match the one in your Firebase project console.
// Any mismatch, especially in projectId or authDomain, can cause authentication errors.
const firebaseConfig = {
  apiKey: "AIzaSyBFP3Kw2utcma-U_UBtXi8U13svHz-AACA",
  authDomain: "lab-instrument-manager.firebaseapp.com",
  projectId: "lab-instrument-manager",
  storageBucket: "lab-instrument-manager.firebasestorage.app",
  messagingSenderId: "917977926439",
  appId: "1:917977926439:web:50231520fd952a60217702",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services to be used throughout the app
export { auth, db };
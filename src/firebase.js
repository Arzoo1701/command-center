// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVMMFQBOUgtAXqX4lZcnBJeDWCn_pVJiI",
  authDomain: "ai-command-center-edd69.firebaseapp.com",
  projectId: "ai-command-center-edd69",
  storageBucket: "ai-command-center-edd69.firebasestorage.app",
  messagingSenderId: "1076429686169",
  appId: "1:1076429686169:web:4352cc2ae42236456b3f08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
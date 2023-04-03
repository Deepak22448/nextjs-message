// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNg8YAjcr3dIEmPhGYGFxlbSAiSfRt8Y0",
  authDomain: "sideproject-msg.firebaseapp.com",
  projectId: "sideproject-msg",
  storageBucket: "sideproject-msg.appspot.com",
  messagingSenderId: "390383477256",
  appId: "1:390383477256:web:ec7f8df7f83f84f14327bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

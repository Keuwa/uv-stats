// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAApwNwjZSaAZpMkN4FV4yu9c_qpTbMLBI",
  authDomain: "uv-stats.firebaseapp.com",
  projectId: "uv-stats",
  storageBucket: "uv-stats.appspot.com",
  messagingSenderId: "98040219841",
  appId: "1:98040219841:web:0227e2d0148cfb07d32c40",
  measurementId: "G-W3F8YQBF29"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)

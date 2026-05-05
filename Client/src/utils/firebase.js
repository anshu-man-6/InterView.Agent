
import {getAuth, GoogleAuthProvider} from "firebase/auth"


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewagent-9af53.firebaseapp.com",
  projectId: "interviewagent-9af53",
  storageBucket: "interviewagent-9af53.firebasestorage.app",
  messagingSenderId: "1096858790498",
  appId: "1:1096858790498:web:6330e6703785a66ef9ff3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth=getAuth(app)

const provider=new GoogleAuthProvider()

export {auth,provider}
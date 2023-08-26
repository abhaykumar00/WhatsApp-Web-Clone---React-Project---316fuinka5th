//this firebase is use for google authentication

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIy1BSYLgqgoXSduLvkaNkw9m6paHZ8mE",
  authDomain: "whatsapp-8ecbf.firebaseapp.com",
  projectId: "whatsapp-8ecbf",
  storageBucket: "whatsapp-8ecbf.appspot.com",
  messagingSenderId: "939992906257",
  appId: "1:939992906257:web:d0d1e87ea5c2fe9d584fb0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

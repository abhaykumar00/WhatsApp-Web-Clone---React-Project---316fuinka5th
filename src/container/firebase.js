//this firebase is use for google authentication

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAEdLKAmit30Gzrd19FynNR7Ryeqg59Cio",
  authDomain: "whatsapp-874b2.firebaseapp.com",
  projectId: "whatsapp-874b2",
  storageBucket: "whatsapp-874b2.appspot.com",
  messagingSenderId: "432871392827",
  appId: "1:432871392827:web:a374a89194d2eb2b963e1e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

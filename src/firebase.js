import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEdLKAmit30Gzrd19FynNR7Ryeqg59Cio",
  authDomain: "whatsapp-874b2.firebaseapp.com",
  projectId: "whatsapp-874b2",
  storageBucket: "whatsapp-874b2.appspot.com",
  messagingSenderId: "432871392827",
  appId: "1:432871392827:web:a374a89194d2eb2b963e1e",
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

export default firestore;

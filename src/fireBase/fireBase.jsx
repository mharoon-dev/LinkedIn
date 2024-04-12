import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6IV0abep8IWgmdipVNeT-GxQ1eiu3ry4",
  authDomain: "linkedin-clone-4a596.firebaseapp.com",
  projectId: "linkedin-clone-4a596",
  storageBucket: "linkedin-clone-4a596.appspot.com",
  messagingSenderId: "299401835241",
  appId: "1:299401835241:web:aa3f7a9f0222b480d07678",
  measurementId: "G-PC3CWFQSJ5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);



export { app, auth, provider, storage ,signInWithPopup , firebaseConfig };
export default db ;

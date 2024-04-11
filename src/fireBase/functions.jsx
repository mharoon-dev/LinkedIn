import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { firebaseConfig } from "../fireBase/fireBase.jsx";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// google sign in
export function signInAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = await GoogleAuthProvider.credentialFromResult(result);
      const token = await credential.accessToken;
      const user = await result.user;
      console.log(user);
      resolve(user);
    } catch (error) {
      const errorMessage = error.message;
      reject(errorMessage);
    }
  });
}

export function getUserAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        resolve(user);
      } else {
        console.log("User is signed out");
        resolve(null); // Resolve with null if no user is signed in
      }
    });
  });
}

// signout
export function signOutAPI() {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.log("An error happened.");
      console.log(error);
    });
}

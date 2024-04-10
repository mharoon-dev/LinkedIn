import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { firebaseConfig } from "../../fireBase/fireBase.jsx";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "../Slices/userSlice.jsx";
import { useEffect } from "react";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export function signInAPI() {
  return () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
      });
  };
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import db, { firebaseConfig } from "../fireBase/fireBase.jsx";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {

  doc,
  setDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

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

// upload image

export function uploadImage(img, fileName) {
  console.log("img", img);
  return new Promise((resolve, reject) => {
    //const fileName = img.name;
    const storageRef = ref(storage, `posts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           return resolve(downloadURL);
        });
      }
    );
  });
}


// add a document 
export async function addInDB(post) {

  const  saveData = doc(collection(db, "posts"));

 await setDoc(saveData, post) && console.log("data added") 
}

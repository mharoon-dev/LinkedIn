import { initializeApp } from "firebase/app";
import db, { firebaseConfig } from "../fireBase/fireBase.jsx";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";

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
        // console.log(user);
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
  console.log("post", post);

  // Check if all required fields in the post object are defined
  if (post && post.user) {
    const saveData = doc(collection(db, "posts"));

    try {
      await setDoc(saveData, post);
      console.log("data added");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  } else {
    console.error("Invalid post data. Required fields are not defined.");
  }
}

// get all data by timeStamp
export async function getAllDataOrderedByTimestamp(collectionName) {
  try {
    // Creating a query to order the data by timestamp
    const q = query(collection(db, collectionName), orderBy("timestamp"));

    // Getting data from db ordered by timestamp
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map(
        (doc) => doc?._document?.data?.value?.mapValue?.fields
      );
      return {
        status: true,
        data: data,
      };
    } else {
      return {
        status: false,
        message: "No documents found!",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
}

// get a document
export async function getADocument(id) {
  console.log(id);
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

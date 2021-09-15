import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig ={
  apiKey:process.env.APIKEY,
  authDomain:process.env.AUTHDOMAIN,
  databaseURL:process.env.DATABASEURL,
  projectId:process.env.PROJECTID,
  storageBucket:process.env.STORAGEBUCKET,
  messagingSenderId:process.env.MESSAGINGSENDERID,
  appId:process.env.APPID,
}

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth=firebase.auth()
export const db=firebase.firestore()
export const storage=firebase.storage();
export const provider=new firebase.auth.GoogleAuthProvider()
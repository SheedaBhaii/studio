
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-9915448084-db4ad",
  "appId": "1:533046792478:web:48396561584c76c4d5390f",
  "storageBucket": "studio-9915448084-db4ad.firebasestorage.app",
  "apiKey": "AIzaSyAAaYKgt3KZWoobCVLjPLQi8w6SvFqzsX0",
  "authDomain": "studio-9915448084-db4ad.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "533046792478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and providers
export const auth = getAuth(app);
export { 
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};

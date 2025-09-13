import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-9915448084-db4ad",
  "appId": "1:533046792478:web:9844585889f0fc5bd5390f",
  "storageBucket": "studio-9915448084-db4ad.firebasestorage.app",
  "apiKey": "AIzaSyAAaYKgt3KZWoobCVLjPLQi8w6SvFqzsX0",
  "authDomain": "studio-9915448084-db4ad.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "533046792478"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

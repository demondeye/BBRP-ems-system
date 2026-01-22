import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNfHPlD4cjSeYa1PHYJEUmpMlk6R3YsPk",
  authDomain: "bbrp-paper-work.firebaseapp.com",
  projectId: "bbrp-paper-work",
  storageBucket: "bbrp-paper-work.firebasestorage.app",
  messagingSenderId: "1064804750858",
  appId: "1:1064804750858:web:99dededede8153ebf331f3",
  measurementId: "G-95JPP311L7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;

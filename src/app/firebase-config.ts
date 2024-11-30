import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

  const firebaseConfig = {
    apiKey: 'AIzaSyCG21jxEX67NJX4xvTuK0jTrABW-TKHLQw',
    authDomain: 'unit-session.firebaseapp.com',
    projectId: 'unit-session',
    storageBucket: 'unit-session.firebasestorage.app',
    messagingSenderId: '702532803931',
    appId: '1:702532803931:web:a652a2e21ab4a772a20e7e',
    measurementId: 'G-GQFBCTK8JB'
  };

  export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
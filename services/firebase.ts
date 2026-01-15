
// Fix: Using namespace imports for Firebase to resolve member resolution issues in the build environment
import * as firebaseApp from "firebase/app";
import * as firestorePkg from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWhVfIipdzjwIwZ_E8qLxre4bUvFQS694",
  authDomain: "mustafa-f8d59.firebaseapp.com",
  projectId: "mustafa-f8d59",
  storageBucket: "mustafa-f8d59.firebasestorage.app",
  messagingSenderId: "326523048160",
  appId: "1:326523048160:web:3435e9bafdc5f125bc0085",
  measurementId: "G-6WSZHES80Z"
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig);

// Initialize Services
export const db = firestorePkg.getFirestore(app);

export default app;

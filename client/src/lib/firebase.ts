import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhDLoMkVeKzLLLOEz6pYTvbzkgfkR69Mo",
  authDomain: "aitravel-f830d.firebaseapp.com",
  projectId: "aitravel-f830d",
  storageBucket: "aitravel-f830d.firebasestorage.app",
  messagingSenderId: "556740806720",
  appId: "1:556740806720:web:c331d473b5ab136da577a5",
  measurementId: "G-TYNS8J9WER"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
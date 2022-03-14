
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0rmd9MEF6NWf3INvp-3QjZLotQ_ilobU",
  authDomain: "house-markeplace-app-e4831.firebaseapp.com",
  projectId: "house-markeplace-app-e4831",
  storageBucket: "house-markeplace-app-e4831.appspot.com",
  messagingSenderId: "700106323505",
  appId: "1:700106323505:web:088a414713f78b8f7e8710"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
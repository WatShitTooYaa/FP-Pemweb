import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBG8pWMejvUW4Xgl50TfIHMjVmwHriwULQ",
    authDomain: "shortener-url-86c6e.firebaseapp.com",
    projectId: "shortener-url-86c6e",
    storageBucket: "shortener-url-86c6e.appspot.com",
    messagingSenderId: "654929913823",
    appId: "1:654929913823:web:f30fd216882bbb6463c66a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4TPwnKGFZYKShjHNfcH-x_Lm70qBhY7Y",
    authDomain: "pizzaeatingcompetition.firebaseapp.com",
    projectId: "pizzaeatingcompetition",
    storageBucket: "pizzaeatingcompetition.firebasestorage.app",
    messagingSenderId: "692244779114",
    appId: "1:692244779114:web:1848c89b73d168e08d3a13"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
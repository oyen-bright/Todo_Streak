import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCpVye5IFwxZ1rY7WqhgRP0rU2iZITSARk",
  authDomain: "todo-streaks-cb996.firebaseapp.com",
  projectId: "todo-streaks-cb996",
  storageBucket: "todo-streaks-cb996.appspot.com",
  messagingSenderId: "350009580458",
  appId: "1:350009580458:web:f34ae6d970055ef1d6e9d3"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
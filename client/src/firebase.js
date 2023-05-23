import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPG7JI_q_eqMWKjac2zoflRbIsInA38Oc",
  authDomain: "wpo-psw.firebaseapp.com",
  projectId: "wpo-psw",
  storageBucket: "wpo-psw.appspot.com",
  messagingSenderId: "1084054946112",
  appId: "1:1084054946112:web:db391e1e40581f355f7aa5",
  measurementId: "G-S6FHJWSR9R",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

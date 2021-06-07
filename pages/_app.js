import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import db from '../firebase'
import Login from "./login";
import Loading from "./loading";
import { useEffect } from 'react'
import firebase from "firebase"

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.email).set(
        {
          email: user.email,
          name: user.displayName,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
          uuid: user.uid
        },
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;


  return <Component {...pageProps} />;
}

export default MyApp;
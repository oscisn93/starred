import "./App.css";
import Home from "./pages/home";
import Landing from "./pages/Landing";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "./components/Loading";
/**
 * Listener for the firebase auth state.
 * https://johnwcassidy.medium.com/firebase-authentication-hooks-and-context-d0e47395f402
 */
function authStateChangedListener(callback) {
  // import the auth object from the firebase module
  const auth = getAuth();
  // this ensures that when the user is logged out the
  // auth state of the app will be set correctly
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // callback is a reference to the setUser function
      callback({ loggedIn: true });
    } else {
      callback({ loggedIn: false });
    }
  });
}

function App() {
  // the user state is used to determine if the user is logged in
  const [user, setUser] = useState({ loggedIn: false });
  const [loading, setLoading] = useState(true);
  // this effect will run once when the app is first loaded
  useEffect(() => {
    const unsubscribe = authStateChangedListener(setUser);
    return () => {
      unsubscribe();
      setTimeout(() => {
        setLoading(false);
      }, 700);
    };
  }, []);
  if (user.loggedIn) {
    return <Home />;
  } else {
    return (loading && <Loading />) || <Landing />;
  }
}

export default App;

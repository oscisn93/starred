import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';

import {firebaseConfig} from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function createAccount(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);

  } catch (err) {
    console.error(err.message);
    return null;
  }
};

export async function signIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
};

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};

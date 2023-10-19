import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';

import {firebaseConfig} from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function createAccount(email, password) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;
    console.table(user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Error ', errorCode, ':', errorMessage);
  }
};

export async function signIn(email, password) {
  try {
    const data = await signInWithEmailAndPassword(auth, email, password);
    console.log(data);
  } catch (err) {
    return console.error(err);
  }
};

export async function signOutUser() {
  try {
    await signOut(auth);
    return console.log('success');
  } catch (err) {
    return console.error(err);
  }
};

import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';

import {firebaseConfig} from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function createAccount(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.table(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error ', errorCode, ':', errorMessage);
      });
};

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
      .then((data) => {
        console.log(data);
      })
      .catch(err => console.error(err));
};

export function signOutUser() {
  return signOut(auth)
      .then(() => console.log('success'))
      .catch((err) => console.error(err));
};

function reauthenticate(password) {
  const user = auth.currentUser;
  const cred = auth.EmailAuthProvider.credential(user.email, password);

  return user.reauthenticateWithCredential(cred);
};

export function changePassword(oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    reauthenticate(oldPassword)
        .then(() => {
          const user = auth.currentUser;
          user.updatePassword(newPassword)
              .then(() => {
                resolve('Password has successsfully been updated!');
              })
              .catch(err => reject(err));
        })
        .catch(err => reject(err));
  });
};

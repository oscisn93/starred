import {auth, db} from  './firebase';
import { doc, setDoc } from "firebase/firestore";
import { UserData } from './types';

const testUser: UserData = {
    email: 'oscar@email.org',
    firstName: 'Oscar',
    lastName: 'The Grouch',
};

async function testClient(userData: UserData, password: string = '') {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not found');
    }

    const guardianID = user.uid;
    const guardianRecord = {
      email: userData.email,
      first: userData.firstName,
      last: userData.lastName,
      dependents: [],
      tasks: [],
      goals: [],
      rewards: [],
    };

    await setDoc(doc(db, "guardian", user.uid), guardianRecord);
}

testClient(testUser);

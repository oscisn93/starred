import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { Role, UserData, TaskData, Task, Goal, Reward } from "./types";

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);

// utility functions
function logError(err: unknown): void {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(err);
  }
}

//TODO: implement custom role-based permissions for tasks, goals, and rewards
//
//
// function verifyPermission(userID: string, role: Role, resource: Task | Goal | Reward): boolean {
//   switch (role) {
//     case 'guardians':
//       return resource.guardianID === userID;
//     case 'dependents':
//       return resource.userID === userID;
//     case 'role-models':
//       return resource.creatorID === userID;
//   }
// }
//

// User services

export async function createGuardianAccount(
  userData: UserData,
  password: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );
    const user = userCredential.user;
    const userRecord = {
      email: userData.email,
      first: userData.firstName,
      last: userData.lastName,
    };

    await setDoc(doc(db, "guardian", user.uid), userRecord);
  } catch (err) {
    logError(err);
  }
}

export async function createDependentAccount(
  userData: UserData,
  guardianID: string,
  password: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "dependent", user.uid), {
      email: userData.email,
      first: userData.firstName,
      last: userData.lastName,
      tasks: [],
      goals: [],
      guardianID: guardianID,
      role_models: [],
    });
  } catch (err) {
    logError(err);
  }
}

export async function createRoleModelAccount(
  userData: UserData,
  password: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "role-model", user.uid), {
      email: userData.email,
      first: userData.firstName,
      last: userData.lastName,
      tasks: [],
      goals: [],
      dependents: [],
    });
  } catch (err) {
    logError(err);
  }
}

// Tasks serrvices

export async function getTasks(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().tasks;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

export async function getTask(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().tasks;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

export async function addTask(userID: string, task) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks;
      tasks.push(task);
      await setDoc(docRef, { tasks: tasks }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

export async function updateTask(userID: string, taskID: string, task: Task) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks;
      tasks[taskID] = task;
      await setDoc(docRef, { tasks: tasks }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    console.error(err.message);
  }
}

export async function deleteTask(userID, taskID) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks;
      tasks.splice(taskID, 1);
      await setDoc(docRef, { tasks: tasks }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    console.error(err.message);
  }
}

// goals services

export async function getGoals(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().goals;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

export async function getGoal(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().goals;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function addGoal(userID: string, goal) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const goals = docSnap.data().goals;
      goals.push(goal);
      await setDoc(docRef, { goals: goals }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

async function updateGoal(userID: string, goalID: string, goal) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const goals = docSnap.data().goals;
      goals[goalID] = goal;
      await setDoc(docRef, { goals: goals }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

async function deleteGoal(userID, goalID) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const goals = docSnap.data().goals;
      goals.splice(goalID, 1);
      await setDoc(docRef, { goals: goals }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

// rewards services

async function getRewards(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().rewards;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function getReward(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().rewards;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function addReward(userID: string, reward) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const rewards = docSnap.data().rewards;
      rewards.push(reward);
      await setDoc(docRef, { rewards: rewards }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

async function updateReward(userID: string, rewardID: string, reward) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const rewards = docSnap.data().rewards;
      rewards[rewardID] = reward;
      await setDoc(docRef, { rewards: rewards }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

async function deleteReward(userID, rewardID) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const rewards = docSnap.data().rewards;
      rewards.splice(rewardID, 1);
      await setDoc(docRef, { rewards: rewards }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

// wishlist service
async function getWishlist(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      return docSnap.data().wishlist;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function addWishlistItem(userID: string, taskID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const wishlist = docSnap.data().wishlist;
      wishlist.push(item);
      await setDoc(docRef, { wishlist: wishlist }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

async function deleteWishlistItem(userID: string, taskID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await docRef.get();
    if (docSnap.exists()) {
      const wishlist = docSnap.data().wishlist;
      wishlist.splice(itemID, 1);
      await setDoc(docRef, { wishlist: wishlist }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

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
import {
  Role,
  UserData,
  TaskData,
  Task,
  Goal,
  Reward,
  Resource,
  GoalData,
  RewardData,
} from "./types";

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

// utility functions
function logError(err: unknown): void {
  // handles proper error objects and strings
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(err);
  }
}

//TODO: implement custom role-based permissions for tasks, goals, and rewards
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
      dependents: [],
      tasks: [],
      goals: [],
      rewards: [],
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
      firstName: userData.firstName,
      lastName: userData.lastName,
      points: 0,
      tasks: [],
      goals: [],
      rewards: [],
      guardianID: guardianID,
      roleModels: [],
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

export async function signIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (err) {
    logError(err);
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    logError(err);
  }
}



// Tasks serrvices

/**
 * Determines if a user is authorized to access a resource, a resource is
 * a task, goal, or reward.
 */
async function isAuthorized(
  userID: string,
  resource: Task | Goal | Reward,
  resourceID: string
): Promise<boolean> {
  // make sure user is logged in
  const user = auth.currentUser;
  if (!user) {
    throw new Error("401: Not Authenticated");
  }
  // if user is the creator, guardian, or dependent
  // whose task it is, return true
  if (
    resource.userID === userID ||
    resource.creatorID === user.uid ||
    resource.guardianID === user.uid
  ) {
    return true;
  } else {
  }

  // otherqise, return false
  return false;
}

export async function getTasks(userID: string): Promise<Array<Task>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("401: Not Authenticated");
    }
    const userRef = doc(db, "users", userID);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const tasks = userSnap.data().tasks;
      return tasks;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
  return [];
}

export async function getTask(userID: string) {
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

export async function addTask(userID: string, task: TaskData) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks;
      tasks[taskID] = task;
      await setDoc(docRef, { tasks: tasks }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

export async function deleteTask(userID: string, taskID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tasks = docSnap.data().tasks;
      tasks.splice(taskID, 1);
      await setDoc(docRef, { tasks: tasks }, { merge: true });
    } else {
      console.log("Not a valid user ID");
    }
  } catch (err) {
    logError(err);
  }
}

// goals services

export async function getGoals(userID: string) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().goals;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function addGoal(userID: string, goal: GoalData) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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

async function updateGoal(userID: string, goalID: string, goal: GoalData) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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

async function deleteGoal(goalID: string) {
  try {
    const docRef = doc(db, "users", goalID);
    const docSnap = await getDoc(docRef);
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
    const docSnap = await getDoc(docRef);
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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().rewards;
    } else {
      console.log("No such document!");
    }
  } catch (err) {
    logError(err);
  }
}

async function addReward(userID: string, reward: RewardData) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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

async function updateReward(userID: string, rewardID: string, reward: RewardData) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);
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

async function deleteReward(rewardID: string) {
  try {
    const docRef = doc(db, "users", rewardID);
    const docSnap = await getDoc(docRef);
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

// // wishlist service
// async function getWishlist(userID: string) {
//   try {
//     const docRef = doc(db, "users", userID);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       return docSnap.data().wishlist;
//     } else {
//       console.log("No such document!");
//     }
//   } catch (err) {
//     logError(err);
//   }
// }

// async function addWishlistItem(userID: string, rewardID: string) {
//   try {
//     const docRef = doc(db, "users", userID);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const wishlist = docSnap.data().wishlist;
//       wishlist.push();
//       await setDoc(docRef, { wishlist: wishlist }, { merge: true });
//     } else {
//       console.log("Not a valid user ID");
//     }
//   } catch (err) {
//     logError(err);
//   }
// }

// async function deleteWishlistItem(userID: string, taskID: string) {
//   try {
//     const docRef = doc(db, "users", userID);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const wishlist = docSnap.data().wishlist;
//       wishlist.splice(itemID, 1);
//       await setDoc(docRef, { wishlist: wishlist }, { merge: true });
//     } else {
//       console.log("Not a valid user ID");
//     }
//   } catch (err) {
//     logError(err);
//   }
// }

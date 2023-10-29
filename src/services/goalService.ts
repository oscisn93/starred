// goals services

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { logError } from "./utils";
import { GoalData, Goal } from "./types";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export class GoalService {
  constructor(private auth: Auth, private db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  async getGoals(userID: string) {
    // get the tasks
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        // if the user is not the owner of the tasks, get the tasks from the tasks collection
        if (
          user.uid !== userID &&
          userSnap.exists() &&
          userSnap.data().role !== "dependents"
        ) {
          // select the correct roleID
          const roleID =
            userSnap.data().role === "guardians" ? "guardianID" : "creatorID";
          // get the tasks that the user has created or is a guardian of
          const goalsRef = collection(this.db, "goals");
          const goalsQuery = query(goalsRef, where(roleID, "==", userID));
          // get the tasks from the query object and transform
          // them into a typescript array of tasks
          const goalsQuerySnap = await getDocs(goalsQuery);
          return goalsQuerySnap.docs.map((doc) => {
            return {
              ...doc.data(),
              goalID: doc.id,
            } as Goal;
          });
        }
        const goals = userSnap.data().goals;
        return goals;
      } else {
        throw new Error("404: User not found.");
      }
    } catch (err) {
      logError(err);
    }
    return [];
  }

  async get(goalID: string) {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const goalRef = doc(this.db, "goals", goalID);
      const goalSnap = await getDoc(goalRef);
      // check if user is authorized to get the goal
      if (goalSnap.exists()) {
        if (
          goalSnap.data().userID !== user.uid ||
          goalSnap.data().creatorID !== user.uid ||
          goalSnap.data().guardianID !== user.uid
        ) {
          throw new Error("403: Not Authorized");
        }
        return goalSnap.data();
      } else {
        throw new Error("404: goal not found.");
      }
    } catch (err) {
      logError(err);
    }
  }

  /** Add a goal to the goals and users collections
   */
  async addGoal(goal: GoalData): Promise<string | null> {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const goalRecord: Goal = {
        ...goal,
        goalID: "",
        tasks: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      // add the goal to the goals collection
      const goalRef = await addDoc(collection(this.db, "goals"), goalRecord);
      // add the goal to the user's copy of goals
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      goalRecord.goalID = goalRef.id;
      if (userSnap.exists()) {
        const usergoals = userSnap.data().goals;
        usergoals[goalRef.id] = goal;
        await setDoc(userRef, { goals: usergoals }, { merge: true });
      }
      return goalRef.id;
    } catch (err) {
      logError(err);
    } finally {
      return null;
    }
  }
  /**
   * Update a goal in the goals and users collections
   */
  async updateGoal(goalID: string, goal: GoalData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      // first update the goal
      const goalRef = doc(this.db, "goals", goalID);
      await setDoc(goalRef, { ...goal }, { merge: true });
      // then update the user's copy of goals
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const usergoals = userSnap.data().goals;
        usergoals[goalID] = goal;
        await setDoc(userRef, { goals: usergoals }, { merge: true });
      }
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Delete a goal from goals and users collections
   */
  async deleteGoal(goalID: string) {
    // check if the user is authenticated
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("401: Not Authenticated");
    }
    // delete the goal
    try {
      // get a reference to the goal and user
      const goalRef = doc(this.db, "goals", goalID);
      const userRef = doc(this.db, "users", user.uid);
      // delete the goal from the goals collection
      await setDoc(goalRef, { deleted: true }, { merge: true });
      // delete the goal from the user's copy of goals
      await setDoc(userRef, { deleted: true }, { merge: true });
    } catch (err) {
      logError(err);
    }
  }
}

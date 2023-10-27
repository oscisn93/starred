// goals services

import { doc, getDoc, setDoc } from "firebase/firestore";
import { logError } from "./utils";
import { GoalData, Goal } from "./types";
import  { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export class GoalService {
  private goals: Goal[];
  constructor(private auth: Auth, private db: Firestore) {
    this.auth = auth;
    this.db = db;
    this.goals = [];
  }

async getGoals(userID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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
  
  async getGoal(userID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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
  
  async addGoal(userID: string, goal: GoalData) {
    try {
      const docRef = doc(this.db, "users", userID);
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
  
  async updateGoal(userID: string, goalID: string, goal: GoalData) {
    try {
      const docRef = doc(this.db, "users", userID);
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
  
  async deleteGoal(goalID: string) {
    try {
      const docRef = doc(this.db, "users", goalID);
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
}

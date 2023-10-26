// goals services

import { doc, getDoc, setDoc } from "firebase/firestore";
import { logError } from "./firebase";
import { GoalData } from "./types";
import { db } from "./userService";

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
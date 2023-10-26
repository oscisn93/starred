// rewards services

import { doc, getDoc, setDoc } from "firebase/firestore";
import { logError } from "./firebase";
import { RewardData } from "./types";
import { db } from "./userService";

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
  
  async function updateReward(
    userID: string,
    rewardID: string,
    reward: RewardData
  ) {
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
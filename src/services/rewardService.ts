// rewards services

import { doc, getDoc, setDoc } from "firebase/firestore";
import { logError } from "./utils";
import { RewardData, Reward } from "./types";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export class RewardService {
  private rewards: Reward[];
  constructor(private auth: Auth, private db: Firestore) {
    this.auth = auth;
    this.db = db;
    this.rewards = [];
  }
  async getRewards(userID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async getReward(userID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async addReward(userID: string, reward: RewardData) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async updateReward(userID: string, rewardID: string, reward: RewardData) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async deleteReward(rewardID: string) {
    try {
      const docRef = doc(this.db, "users", rewardID);
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
}

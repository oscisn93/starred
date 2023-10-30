// rewards services

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
import { RewardData, Reward } from "../types";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export class RewardService {
  private rewards: Reward[];
  constructor(private auth: Auth, private db: Firestore) {
    this.auth = auth;
    this.db = db;
    this.rewards = [];
  }
  /**
   * Get all rewards from the rewards collection
   */
  async getAll(userID: string): Promise<Array<Reward>> {
    // get the rewards
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        // if the user is not the owner of the rewards, get the rewards from the rewards collection
        if (
          user.uid !== userID &&
          userSnap.exists() &&
          userSnap.data().role !== "dependents"
        ) {
          // select the correct roleID
          const roleID =
            userSnap.data().role === "guardians" ? "guardianID" : "creatorID";
          // get the rewards that the user has created or is a guardian of
          const rewardsRef = collection(this.db, "rewards");
          const rewardsQuery = query(rewardsRef, where(roleID, "==", userID));
          // get the rewards from the query object and transform
          // them into a typescript array of rewards
          const rewardsQuerySnap = await getDocs(rewardsQuery);
          return rewardsQuerySnap.docs.map((doc) => {
            return {
              ...doc.data(),
              rewardID: doc.id,
            } as Reward;
          });
        }
        const rewards = userSnap.data().rewards;
        return rewards;
      } else {
        throw new Error("404: User not found.");
      }
    } catch (err) {
      logError(err);
    }
    return [];
  }
  /**
   * Get a reward from the rewards collection, given a rewardID
   */
  async get(rewardID: string) {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const rewardRef = doc(this.db, "rewards", rewardID);
      const rewardSnap = await getDoc(rewardRef);
      // check if user is authorized to get the reward
      if (rewardSnap.exists()) {
        if (
          rewardSnap.data().userID !== user.uid ||
          rewardSnap.data().creatorID !== user.uid ||
          rewardSnap.data().guardianID !== user.uid
        ) {
          throw new Error("403: Not Authorized");
        }
        return rewardSnap.data();
      } else {
        throw new Error("404: reward not found.");
      }
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Add a reward to the rewards and users collections
   */
  async addReward(reward: RewardData): Promise<string | null> {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const rewardRecord: Reward = {
        ...reward,
        rewardID: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      // add the reward to the rewards collection
      const rewardRef = await addDoc(
        collection(this.db, "rewards"),
        rewardRecord
      );
      // add the reward to the user's copy of rewards
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      rewardRecord.rewardID = rewardRef.id;
      if (userSnap.exists()) {
        const userrewards = userSnap.data().rewards;
        userrewards[rewardRef.id] = reward;
        await setDoc(userRef, { rewards: userrewards }, { merge: true });
      }
      return rewardRef.id;
    } catch (err) {
      logError(err);
    } finally {
      return null;
    }
  }
  /**
   * Update a reward in the rewards and users collections
   */
  async updateReward(rewardID: string, reward: RewardData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      // first update the reward
      const rewardRef = doc(this.db, "rewards", rewardID);
      await setDoc(rewardRef, { ...reward }, { merge: true });
      // then update the user's copy of rewards
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userrewards = userSnap.data().rewards;
        userrewards[rewardID] = reward;
        await setDoc(userRef, { rewards: userrewards }, { merge: true });
      }
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Delete a reward from rewards and users collections
   */
  async deleteReward(rewardID: string) {
    // check if the user is authenticated
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("401: Not Authenticated");
    }
    // delete the reward
    try {
      // get a reference to the reward and user
      const rewardRef = doc(this.db, "rewards", rewardID);
      const userRef = doc(this.db, "users", user.uid);
      // delete the reward from the rewards collection
      await setDoc(rewardRef, { deleted: true }, { merge: true });
      // delete the reward from the user's copy of rewards
      await setDoc(userRef, { deleted: true }, { merge: true });
    } catch (err) {
      logError(err);
    }
  }
}

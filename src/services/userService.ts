import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, Firestore } from "firebase/firestore";
import { logError } from "./utils";
import { UserData, Role, Goal, Reward, Task } from "./types";

export class UserService {
  private auth: Auth;
  private db: Firestore;
  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  private async createGuardianAccount(userData: UserData, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
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

      await setDoc(doc(this.db, "guardian", user.uid), userRecord);
    } catch (err) {
      logError(err);
    }
  }

  private async createDependentAccount(userData: UserData, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(this.db, "dependent", user.uid), {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        points: 0,
        tasks: [],
        goals: [],
        rewards: [],
        guardianID: user.uid,
        roleModels: [],
      });
    } catch (err) {
      logError(err);
    }
  }

  private async createRoleModelAccount(userData: UserData, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(this.db, "role-model", user.uid), {
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

  async registerUser(
    userData: UserData,
    password: string,
    confirmedPassword: string,
    role: Role
  ): Promise<void> {
    if (password !== confirmedPassword) {
      throw new Error("403: Passwords do not match");
    }

    switch (role) {
      case "guardians":
        this.createGuardianAccount(userData, password);
        break;
      case "role-models":
        this.createRoleModelAccount(userData, password);
        break;
      case "dependents":
        this.createDependentAccount(userData, password);
        break;
      default:
        throw new Error("403: Invalid Role");
    }
  }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err) {
      logError(err);
    }
  }

  async signOutUser() {
    try {
      await signOut(this.auth);
    } catch (err) {
      logError(err);
    }
  }

  async isAuthorized(
    userID: string,
    resource: Task | Goal | Reward
  ): Promise<boolean> {
    // make sure user is logged in
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("401: Not Authenticated");
    }
    // if user is the creator, guardian, or dependent
    // whose resource it is, return true
    if (
      resource.userID === userID ||
      resource.creatorID === user.uid ||
      resource.guardianID === user.uid
    ) {
      return true;
    }
    // otherwise, return false
    return false;
  }
}

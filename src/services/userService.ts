import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, Firestore } from "firebase/firestore";
import { logError } from "./utils";
import { UserData, Role, Goal, Reward, Task, AppUser } from "./types";

/**
 * This class is responsible for all user related firebase services
 */
export class UserService {
  private auth: Auth;
  private db: Firestore;
  // inject the auth and db services
  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }
  /**
   * Create a new guardian account
   */
  private async createGuardianAccount(userData: UserData, password: string) {
    try {
      // create the user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        password
      );
      if (!userCredential) {
        throw new Error("403: User not created");
      }
      // create the user record
      const user = userCredential.user;
      const userRecord: AppUser = {
        userID: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "guardians",
        points: null,
        tasks: [],
        goals: [],
        rewards: [],
        guardianID: user.uid,
        roleModels: [],
        dependents: [],
      };
      // add the user record to the database
      await setDoc(doc(this.db, "users", user.uid), userRecord);
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Create a new dependent account
   */
  private async createDependentAccount(userData: UserData, password: string) {
    try {
      // create the user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        password
      );
      // get a reference to the user
      const user = userCredential.user;
      if (!user) {
        throw new Error("403: User not created");
      }
      // create the user record
      const userRecord: AppUser = {
        userID: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "dependents",
        points: 0,
        tasks: [],
        goals: [],
        rewards: [],
        guardianID: null,
        roleModels: [],
        dependents: [],
      };
      // add the user record to the database
      await setDoc(doc(this.db, "users", user.uid), userRecord);
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Create a new role model account
   */
  private async createRoleModelAccount(userData: UserData, password: string) {
    try {
      // create the user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        password
      );
      // get a reference to the user
      const user = userCredential.user;
      if (!user) {
        throw new Error("403: User not created");
      }
      // create the user record
      const userRecord: AppUser = {
        userID: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "role-models",
        points: null,
        tasks: [],
        goals: [],
        rewards: [],
        guardianID: null,
        roleModels: [],
        dependents: [],
      };
      // add the user record to the database
      await setDoc(doc(this.db, "users", user.uid), userRecord);
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Create a new user account based on role
   */
  async registerUser(
    userData: UserData,
    password: string,
    confirmedPassword: string
  ): Promise<void> {
    // check if the passwords match
    if (password !== confirmedPassword) {
      throw new Error("403: Passwords do not match");
    }
    // redirect based on role
    switch (userData.role) {
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
  /**
   * A wrapper for the firebase sign in method
   */
  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err) {
      logError(err);
    }
  }
  /**
   * A wrapper for the firebase sign out method
   */
  async signOutUser() {
    try {
      await signOut(this.auth);
    } catch (err) {
      logError(err);
    }
  }
}

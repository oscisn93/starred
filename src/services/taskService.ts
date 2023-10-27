import { Firestore, addDoc, doc, getDoc, setDoc, collection } from "firebase/firestore";
import { Task } from "./types";
import { Auth } from "firebase/auth";
import { logError } from "./utils";

export class TaskService {
  private auth: Auth;
  private db: Firestore;
  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  async getAll(): Promise<Array<Task>> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const userRef = doc(this.db, "users", user.uid);
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

  async get(taskID: string) {
    try {
      const docRef = doc(this.db, "tasks", taskID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      logError(err);
    }
  }

  async addTask(task: Task) {
    const user = this.auth.currentUser;

    if (!user) {
      throw new Error("401: Not Authenticated");
    }

    try {
      const docRef = await addDoc(collection(this.db, "tasks"), task);

    } catch (err) {
      logError(err);
    }
  }

  async updateTask(taskID: string, task: Task) {
    const user = this.auth.currentUser;

    if (!user) {
      throw new Error("401: Not Authenticated");
    }

    try {
      // first update the task
      const docRef = doc(this.db, "tasks", taskID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tasks = docSnap.data();
        tasks[taskID] = task;
        await setDoc(docRef, { tasks: tasks }, { merge: true });
      } else {
        console.log("Not a valid taskID");
      }
    } catch (err) {
      logError(err);
    }
  }

  async deleteTask(userID: string, taskID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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
}

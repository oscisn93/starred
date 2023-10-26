import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Task, TaskData } from "./types";
import { Auth } from "firebase/auth";
import { logError } from "./firebase";

export class TaskService {
  private auth: Auth;
  private db: Firestore;
  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  async getTasks(userID: string): Promise<Array<Task>> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const userRef = doc(this.db, "users", userID);
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

  async getTask(userID: string) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async addTask(userID: string, task: TaskData) {
    try {
      const docRef = doc(this.db, "users", userID);
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

  async updateTask(userID: string, taskID: string, task: Task) {
    try {
      const docRef = doc(this.db, "users", userID);
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

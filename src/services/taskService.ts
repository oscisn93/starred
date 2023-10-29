import {
  Firestore,
  addDoc,
  doc,
  getDoc,
  setDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Task, TaskData } from "./types";
import { Auth } from "firebase/auth";
import { logError } from "./utils";
/**
 * This class is responsible for all task related services
 */
export class TaskService {
  private auth: Auth;
  private db: Firestore;
  constructor(auth: Auth, db: Firestore) {
    this.auth = auth;
    this.db = db;
  }

  /**
   * Get all tasks from the tasks collection
   */
  async getAll(userID: string): Promise<Array<Task>> {
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
          const tasksRef = collection(this.db, "tasks");
          const tasksQuery = query(tasksRef, where(roleID, "==", userID));
          // get the tasks from the query object and transform
          // them into a typescript array of tasks
          const tasksQuerySnap = await getDocs(tasksQuery);
          return tasksQuerySnap.docs.map((doc) => {
            return {
              ...doc.data(),
              taskID: doc.id,
            } as Task;
          });
        }
        const tasks = userSnap.data().tasks;
        return tasks;
      } else {
        throw new Error("404: User not found.");
      }
    } catch (err) {
      logError(err);
    }
    return [];
  }
  /**
   * Get a task from the tasks collection, given a taskID
   */
  async get(taskID: string) {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const taskRef = doc(this.db, "tasks", taskID);
      const taskSnap = await getDoc(taskRef);
      // check if user is authorized to get the task
      if (taskSnap.exists()) {
        if (
          taskSnap.data().userID !== user.uid ||
          taskSnap.data().creatorID !== user.uid ||
          taskSnap.data().guardianID !== user.uid
        ) {
          throw new Error("403: Not Authorized");
        }
        return taskSnap.data();
      } else {
        throw new Error("404: Task not found.");
      }
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Add a task to the tasks and users collections
   */
  async addTask(task: TaskData): Promise<string | null> {
    try {
      // check if the user is authenticated
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      const taskRecord: Task = {
        ...task,
        taskID: "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      // add the task to the tasks collection
      const taskRef = await addDoc(collection(this.db, "tasks"), taskRecord);
      // add the task to the user's copy of tasks
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      taskRecord.taskID = taskRef.id;
      if (userSnap.exists()) {
        const userTasks = userSnap.data().tasks;
        userTasks[taskRef.id] = task;
        await setDoc(userRef, { tasks: userTasks }, { merge: true });
      }
      return taskRef.id;
    } catch (err) {
      logError(err);
    } finally {
      return null;
    }
  }
  /**
   * Update a task in the tasks and users collections
   */
  async updateTask(taskID: string, task: TaskData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("401: Not Authenticated");
      }
      // first update the task
      const taskRef = doc(this.db, "tasks", taskID);
      await setDoc(taskRef, { ...task }, { merge: true });
      // then update the user's copy of tasks
      const userRef = doc(this.db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userTasks = userSnap.data().tasks;
        userTasks[taskID] = task;
        await setDoc(userRef, { tasks: userTasks }, { merge: true });
      }
    } catch (err) {
      logError(err);
    }
  }
  /**
   * Delete a task from tasks and users collections
   */
  async deleteTask(taskID: string) {
    // check if the user is authenticated
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("401: Not Authenticated");
    }
    // delete the task
    try {
      // get a reference to the task and user
      const taskRef = doc(this.db, "tasks", taskID);
      const userRef = doc(this.db, "users", user.uid);
      // delete the task from the tasks collection
      await setDoc(taskRef, { deleted: true }, { merge: true });
      // delete the task from the user's copy of tasks
      await setDoc(userRef, { deleted: true }, { merge: true });
    } catch (err) {
      logError(err);
    }
  }
}

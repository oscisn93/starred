import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
} from "firebase/auth";
import {
  Firestore,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { TaskService } from "./taskService";
import { UserService } from "./userService";

export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  public auth: Auth;
  public userService: UserService;
  public taskService: TaskService;
  public goalService: GoalService;
  public rewardService: RewardService;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.userService = new UserService(this.auth, this.db);
    this.taskService = new TaskService(this.auth, this.db);
    this.goalService = new GoalService(this.auth, this.db);
    this.rewardService = new RewardService(this.auth, this.db);
  }
}

export const firebaseService = new FirebaseService();
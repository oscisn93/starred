import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";
import { TaskService } from "./taskService";
import { UserService } from "./userService";
import { GoalService } from "./goalService";
import { RewardService } from "./rewardService";

class FirebaseService {
  /**
   * app is a firebase app instance
   */
  private readonly app: FirebaseApp;
  /**
   * auth is a firebase auth instance
   */
  public readonly auth: Auth;
  /**
   * db is a reference to our firebase firestore instance
   */
  private readonly db: Firestore;
  /**
   * the userService handles all user data
   */
  public readonly userService: UserService;
  /**
   * the taskService handles all task data
   */
  public readonly taskService: TaskService;
  /**
   * the goalService handles all goal data
   */
  public readonly goalService: GoalService;
  /**
   * the rewardService handles all reward data
   */
  public readonly rewardService: RewardService;
  /**
   * The constructor initializes the firebase app, auth, and db
   * and initializes the services by injecting the apporiate dependencies
   * to each service class instance.
   */
  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    // Initialize Firestore
    this.db = getFirestore(this.app);
    // Initialize Auth
    this.auth = getAuth(this.app);
    // Initialize Services
    this.userService = new UserService(this.auth, this.db);
    this.taskService = new TaskService(this.auth, this.db);
    this.goalService = new GoalService(this.auth, this.db);
    this.rewardService = new RewardService(this.auth, this.db);
  }
}

/**
 * firebaseService is a singleton instance of FirebaseService
 */
export const { auth, userService, taskService, goalService, rewardService } =
  new FirebaseService();

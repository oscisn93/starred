import { Timestamp } from "firebase/firestore";

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
}

type Role = "guardians" | "dependents" | "role-models";

interface Resource {
  userID: string;
  creatorID: string;
  guardianID: string;
}

export interface TaskData extends Resource {
  title: string;
  description: string | null;
  completed: boolean;
  goalID: string;
  dueDate: Date | null;
  points: number;
}

export interface Task extends TaskData {
  taskID: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GoalData extends Resource {
  title: string;
  description: string | null;
}

export interface Goal extends GoalData {
  goalID: string;
  tasks: Task[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RewardData extends Resource {
  name: string;
  price: number;
  description: string | null;
  points: number;
  url: string | null;
  approved: boolean;
  earned: boolean;
}

export interface Reward extends RewardData {
  rewardID: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

import { Timestamp } from "firebase/firestore";

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

export type Task = TaskData & {
  taskID: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GoalData extends Resource {
  title: string;
  description: string | null;
}

export type Goal = GoalData & {
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

export type Reward  = RewardData & {
  rewardID: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type Role = "guardians" | "dependents" | "role-models";

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export type AppUser = UserData & {
  userID: string;
  points: number | null;
  tasks: Task[];
  goals: Goal[];
  rewards: Reward[];
  guardianID: string | null;
  roleModels: AppUser[];
  dependents: AppUser[];
};

import type { Category } from "@/types/category";

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  taskId: number;
  title: string;
  category: Category;
  priority: TaskPriority;
  isStarred: boolean;
  deadline: string;
  estimatedTime: number;
  status: TaskStatus;
  progressRate: number;
  lastMemo: string | null;
}

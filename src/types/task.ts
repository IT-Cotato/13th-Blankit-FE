export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  taskId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  priority: TaskPriority;
  isStarred: boolean;
  deadline: string;
  estimatedTime: number;
  status: TaskStatus;
  progressRate: number;
  lastMemo: string | null;
}
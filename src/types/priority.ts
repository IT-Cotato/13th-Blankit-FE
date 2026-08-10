import type { TaskPriority, TaskStatus } from "@/types/task";

export interface PriorityTask {
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

import type { TaskPriority, TaskStatus } from "@/types/task";

export type CombinationModeId =
  | "fire"
  | "balance"
  | "quick-try"
  | "get-it-done";

export type CombinationAccent =
  | "red"
  | "green"
  | "purple"
  | "orange";

export interface CombinationTask {
  id: string;
  title: string;
  lastMemo: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  progressRate: number;
  estimatedMinutes: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
}

export interface TaskCombination {
  id: CombinationModeId;
  name: string;
  description: string;
  icon: string;
  accent: CombinationAccent;
  tasks: CombinationTask[];
}

export interface PlaylistTask extends CombinationTask {
  sourceModeId: CombinationModeId;
}

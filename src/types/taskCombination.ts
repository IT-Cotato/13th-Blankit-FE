import type { Category } from "@/types/category";
import type { TaskPriority, TaskStatus } from "@/types/task";
import type { PlaylistSourceMode } from "@/types/playlistApi";

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
  priority: TaskPriority;
  status: TaskStatus;
  progressRate: number;
  estimatedMinutes: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  category: Category;
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
  taskId?: number;
  playlistItemId?: number;
  sourceMode?: PlaylistSourceMode;
  sourceModeId?: CombinationModeId;
}

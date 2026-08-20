import type { CategoryIconKey } from "@/types/category";
import type { TaskPriority } from "@/types/task";

export interface RecommendedTaskItem {
  taskId: number;
  title: string;
  memo: string | null;
  priority: TaskPriority;
  categoryColor: string;
  categoryIconKey: CategoryIconKey;
  rankOrder: number;
  score: number;
  recommendedMinutes: number | null;
  progressRate: number;
}

export interface TodayRecommendationResponse {
  recommendedDate: string;
  totalRecommendedMinutes: number;
  topTasks: RecommendedTaskItem[];
}

export interface AllRecommendationResponse {
  recommendedDate: string;
  tasks: RecommendedTaskItem[];
}

export interface ThirtyMinutePackTaskItem {
  taskId: number;
  title: string;
  categoryName: string;
  categoryColor: string;
  categoryIconKey: string;
  currentProgressRate: number;
  remainingEstimatedMinutes: number;
  progressPerMinute: number;
  expectedProgressIncrease: number;
  memo: string | null;
}

export interface ThirtyMinutePackRecommendationResponse {
  availableMinutes: number;
  tasks: ThirtyMinutePackTaskItem[];
}

export interface ModeTaskItemResponse {
  taskId: number;
  title: string;
  memo: string | null;
  priority: TaskPriority;
  categoryColor: string;
  categoryIconKey: string;
  recommendedMinutes: number;
  progressRate: number | null;
}

export interface RecommendationModeItemResponse {
  mode: string;
  modeName: string;
  description: string;
  tasks: ModeTaskItemResponse[];
}

export interface RecommendationModesResponse {
  modes: RecommendationModeItemResponse[];
}

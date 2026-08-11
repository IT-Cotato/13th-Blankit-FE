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

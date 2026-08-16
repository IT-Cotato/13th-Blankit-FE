import type { CategoryIconKey } from "@/types/category";
import type {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

export type SearchTaskParams = {
  keyword: string;
  page?: number;
  size?: number;
};

export type SearchHistoryParams = {
  page?: number;
  size?: number;
};

export type SearchTask = {
  taskId: number;
  title: string;
  memo: string | null;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIconKey: CategoryIconKey;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  progressRate: number;
};

export type SearchTaskData = {
  totalCount: number;
  tasks: SearchTask[];
};

export type SearchHistory = {
  searchHistoryId: number;
  keyword: string;
  searchedAt: string;
};

import type {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

export type SearchTask = {
  taskId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
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

export type SearchTaskResponse =
  ApiResponse<SearchTaskData>;

export type SearchHistoryResponse =
  ApiResponse<SearchHistory[]>;

export type DeleteSearchHistoryResponse =
  ApiResponse<string>;
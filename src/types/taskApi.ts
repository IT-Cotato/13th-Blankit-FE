import type { Category, CategoryIconKey } from "@/types/category";
import type {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

export type ReminderOffsetMinutes =
  | 1440
  | 4320
  | 10080;

export type RepeatFrequency =
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

export interface RepeatRuleRequest {
  frequency: RepeatFrequency;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  lastDayOfMonth?: boolean;
  monthOfYear?: number | null;
  startDate: string;
  endDate?: string | null;
}

export interface TaskCreateRequest {
  title: string;
  deadline?: string | null;
  notifyBefore?: ReminderOffsetMinutes;
  notificationEnabled?: boolean;
  repeatRule?: RepeatRuleRequest;
  categoryId?: number;
  estimatedTime?: number | null;
  similarTaskId?: number | null;
}

export interface TaskUpdateRequest {
  title?: string;
  deadline?: string;
  notifyBefore?: ReminderOffsetMinutes;
  notificationEnabled?: boolean;
  repeatRule?: RepeatRuleRequest;
  clearRepeatRule?: boolean;
  categoryId?: number;
  status?: TaskStatus;
  starred?: boolean;
  similarTaskId?: number | null;
  clearSimilarTask?: boolean;
}

export interface NotificationSettingResponse {
  notifyBefore: ReminderOffsetMinutes;
  enabled: boolean;
}

export interface RepeatRuleResponse {
  frequency: RepeatFrequency;
  daysOfWeek: number[];
  daysOfMonth: number[];
  lastDayOfMonth: boolean;
  monthOfYear: number | null;
  startDate: string;
  endDate: string | null;
}

export interface TaskDetailResponse {
  taskId: number;
  title: string;
  category: Category;
  priority: TaskPriority | null;
  progressRate: number;
  starred: boolean;
  estimatedTime: number | null;
  status: TaskStatus;
  deadline: string;
  notificationSetting: NotificationSettingResponse;
  repeatRule: RepeatRuleResponse | null;
  createdAt: string;
  updatedAt: string;
  similarTaskId: number | null;
  similarTaskTitle: string | null;
  sourceTaskId: number | null;
  sourceTaskTitle: string | null;
  totalElapsedTime: number;
}

export interface TaskListResponse {
  taskId: number;
  title: string;
  category: Category;
  priority: TaskPriority | null;
  progressRate: number;
  starred: boolean;
  estimatedTime: number | null;
  recommendedMinutes: number | null;
  status: TaskStatus;
  deadline: string;
  hasSimilarTask: boolean;
  similarTaskId: number | null;
  sourceTaskId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface TaskListParams {
  date?: string;
  status?: TaskStatus;
  categoryId?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface ReminderRangeResponse {
  minimumMinutes: number;
  maximumMinutes: number;
}

export interface TaskFormOptionsResponse {
  defaultCategoryId: number | null;
  defaultReminderOffsetMinutes: ReminderOffsetMinutes;
  defaultRepeatEnabled: boolean;
  categories: Category[];
  reminderRange: ReminderRangeResponse;
  reminderOptions: ReminderOffsetMinutes[];
}

export interface TaskHistoryItemResponse {
  taskId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIconKey: CategoryIconKey;
  deadline: string;
  totalElapsedTime: number;
}

export interface TaskHistoryParams {
  keyword?: string;
  categoryId?: number;
  page?: number;
  size?: number;
}
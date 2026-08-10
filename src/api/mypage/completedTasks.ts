import { apiClient } from "@/api/client";
import type { ApiEnvelope } from "@/types/auth";
import type {
  PageResponse,
  TaskHistoryItemResponse,
  TaskHistoryParams,
} from "@/types/taskApi";

export async function getCompletedTasks(
  params: TaskHistoryParams = {},
): Promise<PageResponse<TaskHistoryItemResponse>> {
  const response = await apiClient.get<
    ApiEnvelope<PageResponse<TaskHistoryItemResponse>>
  >("/api/tasks/history", { params });

  return response.data.data;
}

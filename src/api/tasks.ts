import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  PageResponse,
  TaskCreateRequest,
  TaskDetailResponse,
  TaskFormOptionsResponse,
  TaskHistoryItemResponse,
  TaskHistoryParams,
  TaskListParams,
  TaskListResponse,
  TaskUpdateRequest,
} from "@/types/taskApi";

export async function getTasks(
  params: TaskListParams = {},
): Promise<PageResponse<TaskListResponse>> {
  const response = await apiClient.get<
    ApiEnvelope<PageResponse<TaskListResponse>>
  >("/api/tasks", {
    params,
  });

  return response.data.data;
}

export async function createTask(
  payload: TaskCreateRequest,
): Promise<TaskDetailResponse> {
  const response = await apiClient.post<
    ApiEnvelope<TaskDetailResponse>
  >("/api/tasks", payload);

  return response.data.data;
}

export async function getTask(
  taskId: number,
): Promise<TaskDetailResponse> {
  const response = await apiClient.get<
    ApiEnvelope<TaskDetailResponse>
  >(`/api/tasks/${taskId}`);

  return response.data.data;
}

export async function updateTask(
  taskId: number,
  payload: TaskUpdateRequest,
): Promise<TaskDetailResponse> {
  const response = await apiClient.patch<
    ApiEnvelope<TaskDetailResponse>
  >(`/api/tasks/${taskId}`, payload);

  return response.data.data;
}

export async function deleteTask(
  taskId: number,
): Promise<void> {
  await apiClient.delete(`/api/tasks/${taskId}`);
}

export async function getTaskFormOptions():
Promise<TaskFormOptionsResponse> {
  const response = await apiClient.get<
    ApiEnvelope<TaskFormOptionsResponse>
  >("/api/tasks/form-options");

  return response.data.data;
}

export async function getTaskHistory(
  params: TaskHistoryParams = {},
): Promise<PageResponse<TaskHistoryItemResponse>> {
  const response = await apiClient.get<
    ApiEnvelope<PageResponse<TaskHistoryItemResponse>>
  >("/api/tasks/history", {
    params,
  });

  return response.data.data;
}
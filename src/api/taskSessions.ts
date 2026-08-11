import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  TaskSessionResponse,
  UpdateTaskSessionStatusRequest,
} from "@/types/taskSession";

export async function getActiveTaskSession(
  taskId: number,
): Promise<TaskSessionResponse | null> {
  const response = await apiClient.get<
    ApiEnvelope<TaskSessionResponse | null>
  >(`/api/tasks/${taskId}/sessions/active`);

  return response.data.data;
}

export async function startTaskSession(
  taskId: number,
): Promise<TaskSessionResponse> {
  const response = await apiClient.post<
    ApiEnvelope<TaskSessionResponse>
  >(`/api/tasks/${taskId}/sessions`);

  return response.data.data;
}

export async function updateTaskSessionStatus(
  sessionId: number,
  payload: UpdateTaskSessionStatusRequest,
): Promise<TaskSessionResponse> {
  const response = await apiClient.patch<
    ApiEnvelope<TaskSessionResponse>
  >(`/api/sessions/${sessionId}/status`, payload);

  return response.data.data;
}
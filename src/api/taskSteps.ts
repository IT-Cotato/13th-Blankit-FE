import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  CreateTaskStepRequest,
  TaskStepResponse,
  UpdateTaskStepRequest,
} from "@/types/taskStep";

export async function getTaskSteps(
  taskId: number,
): Promise<TaskStepResponse[]> {
  const response = await apiClient.get<
    ApiEnvelope<TaskStepResponse[]>
  >(`/api/v1/tasks/${taskId}/steps`);

  return response.data.data;
}

export async function createTaskStep(
  taskId: number,
  payload: CreateTaskStepRequest,
): Promise<TaskStepResponse> {
  const response = await apiClient.post<
    ApiEnvelope<TaskStepResponse>
  >(`/api/v1/tasks/${taskId}/steps`, payload);

  return response.data.data;
}

export async function updateTaskStep(
  taskId: number,
  stepId: number,
  payload: UpdateTaskStepRequest,
): Promise<TaskStepResponse> {
  const response = await apiClient.patch<
    ApiEnvelope<TaskStepResponse>
  >(
    `/api/v1/tasks/${taskId}/steps/${stepId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteTaskStep(
  taskId: number,
  stepId: number,
): Promise<void> {
  await apiClient.delete(
    `/api/v1/tasks/${taskId}/steps/${stepId}`,
  );
}
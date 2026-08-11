import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  SubmitTaskFeedbackRequest,
  TaskFeedbackResponse,
} from "@/types/taskFeedbackApi";

export async function getTaskFeedback(
  sessionId: number,
): Promise<TaskFeedbackResponse | null> {
  const response = await apiClient.get<
    ApiEnvelope<TaskFeedbackResponse | null>
  >(`/api/sessions/${sessionId}/feedback`);

  return response.data.data;
}

export async function submitTaskFeedback(
  sessionId: number,
  payload: SubmitTaskFeedbackRequest,
): Promise<TaskFeedbackResponse> {
  const response = await apiClient.post<
    ApiEnvelope<TaskFeedbackResponse>
  >(
    `/api/sessions/${sessionId}/feedback`,
    payload,
  );

  return response.data.data;
}

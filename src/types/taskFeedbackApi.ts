export interface FeedbackStepProgressRequest {
  stepId: number;
  progressRate: number;
}

export interface SubmitTaskFeedbackRequest {
  progressRate: number | null;
  memo: string | null;
  isDraft: boolean;
  steps: FeedbackStepProgressRequest[];
}

export interface TaskFeedbackResponse {
  feedbackId: number;
  taskSessionId: number;
  taskId: number;
  progressRate: number;
  memo: string;
  isCompleted: boolean;
  isDraft: boolean;
}
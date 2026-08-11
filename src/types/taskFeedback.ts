export interface FeedbackStep {
  id: string;
  taskStepId?: number;
  title: string;
  progress: number;
  progressTouched: boolean;
}

export interface TaskFeedbackDraft {
  memo: string;
  progress: number;
  progressTouched: boolean;
  steps: FeedbackStep[];
}

export type FeedbackCompletionResult =
  | "advanced"
  | "stayed";

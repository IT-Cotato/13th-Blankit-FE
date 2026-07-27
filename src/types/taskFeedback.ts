export interface FeedbackStep {
  id: string;
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

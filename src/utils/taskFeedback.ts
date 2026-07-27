import type {
  FeedbackCompletionResult,
  FeedbackStep,
  TaskFeedbackDraft,
} from "../types/taskFeedback";

const DEFAULT_STEP_TITLES = [
  "개념 정리",
  "문제 풀이",
  "전체 복습하기",
] as const;

export function createFeedbackDraft(
  progress: number,
): TaskFeedbackDraft {
  return {
    memo: "",
    progress,
    progressTouched: false,
    steps: [],
  };
}

export function createDefaultFeedbackSteps(): FeedbackStep[] {
  return DEFAULT_STEP_TITLES.map((title, index) => ({
    id: `feedback-step-${index + 1}`,
    title,
    progress: 0,
    progressTouched: false,
  }));
}

export function canCompleteFeedback(
  draft: TaskFeedbackDraft,
) {
  return (
    draft.memo.trim().length > 0 ||
    draft.progressTouched ||
    draft.steps.some((step) => step.progressTouched)
  );
}

export function getFeedbackCompletionResult(
  playlistLength: number,
): FeedbackCompletionResult {
  return playlistLength > 1 ? "advanced" : "stayed";
}

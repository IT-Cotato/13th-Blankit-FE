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
  memo: string | null = null,
): TaskFeedbackDraft {
  const boundedProgress = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;

  return {
    memo: memo?.trim() ?? "",
    progress: boundedProgress,
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

export function appendFeedbackStep(
  steps: FeedbackStep[],
): FeedbackStep[] {
  const nextStepNumber =
    steps.reduce((largestStepNumber, step) => {
      const stepNumber = Number(
        step.id.replace("feedback-step-", ""),
      );

      return Number.isFinite(stepNumber)
        ? Math.max(largestStepNumber, stepNumber)
        : largestStepNumber;
    }, 0) + 1;

  return [
    ...steps,
    {
      id: `feedback-step-${nextStepNumber}`,
      title: "",
      progress: 0,
      progressTouched: false,
    },
  ];
}

export function canCompleteFeedback(
  draft: TaskFeedbackDraft,
) {
  const hasValidStepTitles = draft.steps.every(
    (step) => step.title.trim().length > 0,
  );

  const hasMemo = draft.memo.trim().length > 0;

  const hasProgress =
    draft.progressTouched ||
    draft.steps.some(
      (step) => step.progressTouched,
    );

  return (
    hasValidStepTitles &&
    (hasMemo || hasProgress)
  );
}

export function getFeedbackCompletionResult(
  playlistLength: number,
): FeedbackCompletionResult {
  return playlistLength > 1 ? "advanced" : "stayed";
}

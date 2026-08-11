import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getTaskFeedback,
  submitTaskFeedback,
} from "@/api/taskFeedback";
import { usePlaylistStore } from "@/store/usePlaylistStore";

import type { TaskFeedbackDraft } from "@/types/taskFeedback";
import type { SubmitTaskFeedbackRequest } from "@/types/taskFeedbackApi";

function createFeedbackPayload(
  draft: TaskFeedbackDraft,
  isDraft: boolean,
): SubmitTaskFeedbackRequest {
  const memo = draft.memo.trim();
  const hasSteps = draft.steps.length > 0;

  return {
    progressRate: hasSteps
      ? null
      : draft.progressTouched
        ? Math.round(draft.progress)
        : null,
    memo: memo || null,
    isDraft,
    steps: hasSteps
      ? draft.steps.flatMap((step) =>
          typeof step.taskStepId === "number"
            ? [
                {
                  stepId: step.taskStepId,
                  progressRate: Math.round(
                    step.progress,
                  ),
                },
              ]
            : [],
        )
      : [],
  };
}

function hasFeedbackContent(
  draft: TaskFeedbackDraft,
) {
  return (
    draft.memo.trim().length > 0 ||
    draft.progressTouched ||
    draft.steps.some(
      (step) => step.progressTouched,
    )
  );
}

interface UseTaskFeedbackOptions {
  sessionId: number | null;
  feedbackTaskId: string;
  enabled: boolean;
}

export function useTaskFeedback({
  sessionId,
  feedbackTaskId,
  enabled,
}: UseTaskFeedbackOptions) {
  const draft = usePlaylistStore(
    (state) =>
      state.feedbackDrafts[feedbackTaskId],
  );
  const updateFeedbackMemo = usePlaylistStore(
    (state) => state.updateFeedbackMemo,
  );
  const updateFeedbackProgress = usePlaylistStore(
    (state) => state.updateFeedbackProgress,
  );

  const [isLoadingFeedback, setIsLoadingFeedback] =
    useState(false);
  const [isSavingFeedback, setIsSavingFeedback] =
    useState(false);
  const [feedbackError, setFeedbackError] = useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const saveInFlightRef = useRef(false);

  useEffect(() => {
    if (!enabled || sessionId === null) {
      return;
    }

    let cancelled = false;

    const loadFeedback = async () => {
      setIsLoadingFeedback(true);
      setFeedbackError(null);

      try {
        const feedback =
          await getTaskFeedback(sessionId);

        if (cancelled || !feedback) {
          return;
        }

        updateFeedbackMemo(
          feedbackTaskId,
          feedback.memo ?? "",
        );

        updateFeedbackProgress(
          feedbackTaskId,
          feedback.progressRate,
        );
      } catch {
        if (!cancelled) {
          setFeedbackError(
            "과업 피드백을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFeedback(false);
        }
      }
    };

    void loadFeedback();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    feedbackTaskId,
    refreshKey,
    sessionId,
    updateFeedbackMemo,
    updateFeedbackProgress,
  ]);

  const saveFeedback = useCallback(
    async (isDraft: boolean) => {
        if (!draft || !hasFeedbackContent(draft)) {
        return isDraft;
        }

        if (
        sessionId === null ||
        saveInFlightRef.current
        ) {
        return false;
        }

        saveInFlightRef.current = true;
        setIsSavingFeedback(true);
        setFeedbackError(null);

        try {
        await submitTaskFeedback(
            sessionId,
            createFeedbackPayload(draft, isDraft),
        );

        return true;
        } catch {
        setFeedbackError(
            isDraft
            ? "과업 피드백을 임시 저장하지 못했습니다."
            : "과업 피드백을 완료하지 못했습니다.",
        );

        return false;
        } finally {
        saveInFlightRef.current = false;
        setIsSavingFeedback(false);
        }
    },
    [draft, sessionId],
    );

const saveDraft = useCallback(
  () => saveFeedback(true),
  [saveFeedback],
);

const submitFinalFeedback = useCallback(
  () => saveFeedback(false),
  [saveFeedback],
);

  const refreshFeedback = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    isLoadingFeedback,
    isSavingFeedback,
    feedbackError,
    saveDraft,
    submitFinalFeedback,
    refreshFeedback,
  };
}
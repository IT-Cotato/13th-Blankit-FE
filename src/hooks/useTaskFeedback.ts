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
  hasSavedProgress: boolean,
): SubmitTaskFeedbackRequest {
  const memo = draft.memo.trim();
  const hasSteps = draft.steps.length > 0;

  return {
    progressRate: hasSteps
      ? null
      : draft.progressTouched || hasSavedProgress
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
  hasSavedProgress: boolean,
) {
  return (
    draft.memo.trim().length > 0 ||
    hasSavedProgress ||
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
  const restoreFeedbackProgress = usePlaylistStore(
    (state) => state.restoreFeedbackProgress,
  );

  const [isLoadingFeedback, setIsLoadingFeedback] =
    useState(false);
  const [isSavingFeedback, setIsSavingFeedback] =
    useState(false);
  const [feedbackError, setFeedbackError] = useState<
    string | null
  >(null);
  const [savedProgress, setSavedProgress] = useState<{
    sessionId: number | null;
    progressRate: number | null;
  }>({
    sessionId: null,
    progressRate: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const saveInFlightRef = useRef(false);
  const lastSavedMemoRef = useRef({
    sessionId: null as number | null,
    memo: "",
  });

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

        if (cancelled) {
          return;
        }

        lastSavedMemoRef.current = {
          sessionId,
          memo: feedback?.memo?.trim() ?? "",
        };

        if (!feedback) {
          setSavedProgress({
            sessionId,
            progressRate: null,
          });
          return;
        }

        updateFeedbackMemo(
          feedbackTaskId,
          feedback.memo ?? "",
        );

        const savedProgressRate =
          feedback.progressRate > 0
            ? feedback.progressRate
            : null;

        setSavedProgress({
          sessionId,
          progressRate: savedProgressRate,
        });

        restoreFeedbackProgress(
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
    restoreFeedbackProgress,
  ]);

  const savedProgressRate =
    savedProgress.sessionId === sessionId
      ? savedProgress.progressRate
      : null;
  const hasSavedProgress = savedProgressRate !== null;

  const saveFeedback = useCallback(
    async (
      isDraft: boolean,
      skipIfMemoUnchanged = false,
    ) => {
      if (!draft) {
        return false;
      }

      const currentMemo = draft.memo.trim();
      const lastSavedMemo =
        lastSavedMemoRef.current.sessionId === sessionId
          ? lastSavedMemoRef.current.memo
          : "";
      const memoChanged =
        currentMemo !== lastSavedMemo;
      const hasProgressChanged =
        draft.progressTouched &&
        Math.round(draft.progress) !==
          savedProgressRate;
      const haveStepsChanged = draft.steps.some(
        (step) => step.progressTouched,
      );

      if (
        isDraft &&
        skipIfMemoUnchanged &&
        !memoChanged
      ) {
        return isDraft;
      }

      if (
        isDraft &&
        !memoChanged &&
        !hasProgressChanged &&
        !haveStepsChanged
      ) {
        return true;
      }

      if (
        !hasFeedbackContent(
          draft,
          hasSavedProgress,
        ) &&
        !memoChanged
      ) {
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
        const payload = createFeedbackPayload(
          draft,
          isDraft,
          hasSavedProgress,
        );

        await submitTaskFeedback(
          sessionId,
          payload,
        );

        lastSavedMemoRef.current = {
          sessionId,
          memo: currentMemo,
        };
        setSavedProgress({
          sessionId,
          progressRate: payload.progressRate,
        });

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
    [
      draft,
      hasSavedProgress,
      savedProgressRate,
      sessionId,
    ],
  );

  const saveDraft = useCallback(
    () => saveFeedback(true),
    [saveFeedback],
  );

  const saveMemoDraft = useCallback(
    () => saveFeedback(true, true),
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
    hasSavedProgress,
    saveDraft,
    saveMemoDraft,
    submitFinalFeedback,
    refreshFeedback,
  };
}

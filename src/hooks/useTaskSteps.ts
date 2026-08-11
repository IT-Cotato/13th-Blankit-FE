import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createTaskStep,
  deleteTaskStep,
  getTaskSteps,
  updateTaskStep,
} from "@/api/taskSteps";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import {
  queueStepTitleSave,
  takeNextStepTitleSave,
} from "@/utils/taskStepSaveQueue";

import type { FeedbackStep } from "@/types/taskFeedback";
import type { TaskStepResponse } from "@/types/taskStep";
import type { StepTitleSaveQueue } from "@/utils/taskStepSaveQueue";

const DEFAULT_STEP_TITLES = [
  "개념 정리",
  "문제 풀이",
  "전체 복습하기",
] as const;

function mapTaskStep(
  step: TaskStepResponse,
): FeedbackStep {
  return {
    id: String(step.taskStepId),
    taskStepId: step.taskStepId,
    title: step.title,
    progress: step.progressRate,
    progressTouched: false,
  };
}

interface UseTaskStepsOptions {
  taskId: number | null;
  feedbackTaskId: string;
  enabled: boolean;
}

export function useTaskSteps({
  taskId,
  feedbackTaskId,
  enabled,
}: UseTaskStepsOptions) {
  const replaceFeedbackSteps = usePlaylistStore(
    (state) => state.replaceFeedbackSteps,
  );
  const updateFeedbackStep = usePlaylistStore(
    (state) => state.updateFeedbackStep,
  );
 const removeFeedbackStep = usePlaylistStore(
    (state) => state.removeFeedbackStep,
  );

  const [isLoadingSteps, setIsLoadingSteps] =
    useState(false);
  const [isUpdatingSteps, setIsUpdatingSteps] =
    useState(false);
  const [stepsError, setStepsError] = useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const mutationInFlightRef = useRef(false);
  const pendingStepTitleSavesRef = useRef<
    StepTitleSaveQueue
  >(new Map());
  const saveStepTitleRef = useRef<
    ((step: FeedbackStep, title: string) => Promise<void>) | null
  >(null);
  const savedStepTitlesRef = useRef(
    new Map<number, string>(),
 );

  const applyServerSteps = useCallback(
    (steps: TaskStepResponse[]) => {
        savedStepTitlesRef.current = new Map(
        steps.map((step) => [
            step.taskStepId,
            step.title,
        ]),
        );

        replaceFeedbackSteps(
        feedbackTaskId,
        steps.map(mapTaskStep),
        );
    },
    [feedbackTaskId, replaceFeedbackSteps],
    );

  useEffect(() => {
    if (!enabled || taskId === null) {
      return;
    }

    let cancelled = false;

    const loadSteps = async () => {
      setIsLoadingSteps(true);
      setStepsError(null);

      try {
        const steps = await getTaskSteps(taskId);

        if (!cancelled) {
          applyServerSteps(steps);
        }
      } catch {
        if (!cancelled) {
          setStepsError(
            "과업 세부 단계를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSteps(false);
        }
      }
    };

    void loadSteps();

    return () => {
      cancelled = true;
    };
  }, [
    applyServerSteps,
    enabled,
    refreshKey,
    taskId,
  ]);

  const runNextPendingTitleSave = useCallback(() => {
    if (mutationInFlightRef.current) {
      return;
    }

    let pendingSave = takeNextStepTitleSave(
      pendingStepTitleSavesRef.current,
    );

    while (pendingSave) {
      const currentStep =
        usePlaylistStore
          .getState()
          .feedbackDrafts[
            feedbackTaskId
          ]?.steps.find(
            (step) => step.id === pendingSave?.stepId,
          );

      if (currentStep) {
        void saveStepTitleRef.current?.(
          currentStep,
          pendingSave.title,
        );
        return;
      }

      pendingSave = takeNextStepTitleSave(
        pendingStepTitleSavesRef.current,
      );
    }
  }, [feedbackTaskId]);

  const finishStepMutation = useCallback(() => {
    mutationInFlightRef.current = false;
    setIsUpdatingSteps(false);
    runNextPendingTitleSave();
  }, [runNextPendingTitleSave]);

  const createDefaultSteps = useCallback(async () => {
    if (
      taskId === null ||
      mutationInFlightRef.current
    ) {
      return;
    }

    mutationInFlightRef.current = true;
    setIsUpdatingSteps(true);
    setStepsError(null);

    try {
      for (const title of DEFAULT_STEP_TITLES) {
        await createTaskStep(taskId, { title });
      }

      const steps = await getTaskSteps(taskId);
      applyServerSteps(steps);
    } catch {
      try {
        const steps = await getTaskSteps(taskId);
        applyServerSteps(steps);
      } catch {
        setStepsError(
          "과업 세부 단계를 새로 불러오지 못했습니다.",
        );
        return;
      }

      setStepsError(
        "일부 세부 단계를 생성하지 못했습니다.",
      );
    } finally {
      finishStepMutation();
    }
  }, [applyServerSteps, finishStepMutation, taskId]);

  const saveStepTitle = useCallback(
    async (step: FeedbackStep, title: string) => {
        const trimmedTitle = title.trim();

        if (taskId === null) {
        return;
        }

        if (!trimmedTitle) {
        setStepsError(
            "세부 단계 제목을 입력해 주세요.",
        );
        return;
        }

        if (
        typeof step.taskStepId === "number" &&
        savedStepTitlesRef.current.get(
            step.taskStepId,
        ) === trimmedTitle
        ) {
        return;
        }

        if (mutationInFlightRef.current) {
        queueStepTitleSave(
            pendingStepTitleSavesRef.current,
            step.id,
            trimmedTitle,
        );
        return;
        }

        mutationInFlightRef.current = true;
        setIsUpdatingSteps(true);
        setStepsError(null);

        try {
        const savedStep =
            typeof step.taskStepId === "number"
            ? await updateTaskStep(
                taskId,
                step.taskStepId,
                {
                    title: trimmedTitle,
                },
                )
            : await createTaskStep(taskId, {
                title: trimmedTitle,
                });

        savedStepTitlesRef.current.set(
            savedStep.taskStepId,
            savedStep.title,
        );

        const hasPendingNewerTitle =
            pendingStepTitleSavesRef.current.has(
            step.id,
            );

        updateFeedbackStep(
            feedbackTaskId,
            step.id,
            {
            taskStepId: savedStep.taskStepId,
            progress: savedStep.progressRate,
            ...(hasPendingNewerTitle
                ? {}
                : { title: savedStep.title }),
            },
        );
        } catch {
        const hasPendingNewerTitle =
            pendingStepTitleSavesRef.current.has(
            step.id,
            );

        if (!hasPendingNewerTitle) {
            const lastSavedTitle =
            typeof step.taskStepId === "number"
                ? savedStepTitlesRef.current.get(
                    step.taskStepId,
                )
                : undefined;

            if (lastSavedTitle) {
            updateFeedbackStep(
                feedbackTaskId,
                step.id,
                { title: lastSavedTitle },
            );
            } else {
            removeFeedbackStep(
                feedbackTaskId,
                step.id,
            );
            }
        }

        setStepsError(
            typeof step.taskStepId === "number"
            ? "세부 단계 제목을 저장하지 못했습니다."
            : "세부 단계를 생성하지 못했습니다.",
        );
        } finally {
        finishStepMutation();
        }
    },
    [
      feedbackTaskId,
      finishStepMutation,
      removeFeedbackStep,
      taskId,
      updateFeedbackStep,
    ],
  );

  useEffect(() => {
    saveStepTitleRef.current = saveStepTitle;

    return () => {
      saveStepTitleRef.current = null;
    };
  }, [saveStepTitle]);

  const deleteStep = useCallback(
    async (step: FeedbackStep) => {
        if (mutationInFlightRef.current) {
        return;
        }

        if (typeof step.taskStepId !== "number") {
        removeFeedbackStep(
            feedbackTaskId,
            step.id,
        );
        return;
        }

        if (taskId === null) {
        return;
        }

        mutationInFlightRef.current = true;
        setIsUpdatingSteps(true);
        setStepsError(null);

        try {
        await deleteTaskStep(
            taskId,
            step.taskStepId,
        );

        savedStepTitlesRef.current.delete(
            step.taskStepId,
        );

        removeFeedbackStep(
            feedbackTaskId,
            step.id,
        );
        } catch {
        setStepsError(
            "세부 단계를 삭제하지 못했습니다.",
        );
        } finally {
        finishStepMutation();
        }
    },
    [
      feedbackTaskId,
      finishStepMutation,
      removeFeedbackStep,
      taskId,
    ],
  );
  
  const refreshSteps = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const clearStepsError = useCallback(() => {
    setStepsError(null);
  }, []);

  return {
    isLoadingSteps,
    isUpdatingSteps,
    stepsError,
    createDefaultSteps,
    saveStepTitle,
    deleteStep,
    refreshSteps,
    clearStepsError,
  };
}

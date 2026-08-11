import type { StateCreator } from "zustand";

import type {
  CombinationModeId,
  PlaylistTask,
  TaskCombination,
} from "@/types/taskCombination";
import type {
  FeedbackCompletionResult,
  FeedbackStep,
  TaskFeedbackDraft,
} from "@/types/taskFeedback";

export interface PlaylistTasksState {
  playlist: PlaylistTask[];
  replacePlaylist: (playlist: PlaylistTask[]) => void;
  addCombination: (combination: TaskCombination) => void;
  removeCombination: (modeId: CombinationModeId) => void;
  removeTasks: (taskIds: string[]) => void;
  clearPlaylist: () => void;
  completeCurrentTask: () => void;
  selectTask: (taskId: string) => void;
  reorderTask: (
    activeTaskId: string,
    overTaskId: string,
  ) => void;
  isCombinationAdded: (
    modeId: CombinationModeId,
  ) => boolean;
}

export interface PlaylistTimerState {
  elapsedSeconds: number;
  accumulatedElapsedSeconds: number;
  startedAt: number | null;
  isPlaying: boolean;
  hasStarted: boolean;
  hasSeenCompletionTooltip: boolean;
  restoreTimerFromSession: (
    elapsedSeconds: number,
    isPlaying: boolean,
    now?: number,
  ) => void;
  playCurrentTask: (now?: number) => void;
  pauseCurrentTask: (now?: number) => void;
  dismissCompletionTooltip: () => void;
}

export interface PlaylistFeedbackState {
  feedbackDrafts: Record<string, TaskFeedbackDraft>;
  ensureFeedbackDraft: (taskId: string) => void;
  updateFeedbackMemo: (
    taskId: string,
    memo: string,
  ) => void;
  updateFeedbackProgress: (
    taskId: string,
    progress: number,
  ) => void;
  replaceFeedbackSteps: (
    taskId: string,
    steps: FeedbackStep[],
  ) => void;
  splitFeedbackIntoSteps: (taskId: string) => void;
  addFeedbackStep: (taskId: string) => void;
  updateFeedbackStep: (
    taskId: string,
    stepId: string,
    update: Partial<
      Pick<
        FeedbackStep,
        | "taskStepId"
        | "title"
        | "progress"
        | "progressTouched"
      >
    >,
  ) => void;
  removeFeedbackStep: (
    taskId: string,
    stepId: string,
  ) => void;
  completeFeedback: (
    taskId: string,
  ) => FeedbackCompletionResult | null;
}

export type PlaylistStore =
  PlaylistTasksState &
  PlaylistTimerState &
  PlaylistFeedbackState;

export type PlaylistStoreCreator<T> = StateCreator<
  PlaylistStore,
  [],
  [],
  T
>;

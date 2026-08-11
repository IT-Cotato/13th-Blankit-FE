import {
  EMPTY_PLAYLIST_TIMER_STATE,
} from "@/store/playlist/playlistTimer";
import {
  appendFeedbackStep,
  canCompleteFeedback,
  createDefaultFeedbackSteps,
  createFeedbackDraft,
  getFeedbackCompletionResult,
} from "@/utils/taskFeedback";

import type {
  PlaylistFeedbackState,
  PlaylistStoreCreator,
} from "@/store/playlist/playlistTypes";

export const createPlaylistFeedback: PlaylistStoreCreator<
  PlaylistFeedbackState
> = (set, get) => ({
  feedbackDrafts: {},

  ensureFeedbackDraft: (taskId) => {
    const state = get();

    if (state.feedbackDrafts[taskId]) {
      return;
    }

    const task = state.playlist.find(
      (item) => item.id === taskId,
    );

    if (!task) {
      return;
    }

    set((current) => ({
      feedbackDrafts: {
        ...current.feedbackDrafts,
        [taskId]: createFeedbackDraft(
          task.progressRate,
        ),
      },
    }));
  },

  updateFeedbackMemo: (taskId, memo) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            memo,
          },
        },
      };
    });
  },

  updateFeedbackProgress: (taskId, progress) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            progress,
            progressTouched: true,
          },
        },
      };
    });
  },
  replaceFeedbackSteps: (taskId, steps) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            steps,
          },
        },
      };
    });
  },
  splitFeedbackIntoSteps: (taskId) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft || draft.steps.length > 0) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            steps: createDefaultFeedbackSteps(),
          },
        },
      };
    });
  },

  addFeedbackStep: (taskId) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft || draft.steps.length === 0) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            steps: appendFeedbackStep(draft.steps),
          },
        },
      };
    });
  },

  updateFeedbackStep: (
    taskId,
    stepId,
    update,
  ) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            steps: draft.steps.map((step) =>
              step.id === stepId
                ? {
                    ...step,
                    ...update,
                  }
                : step,
            ),
          },
        },
      };
    });
  },

  removeFeedbackStep: (taskId, stepId) => {
    set((state) => {
      const draft = state.feedbackDrafts[taskId];

      if (!draft) {
        return state;
      }

      return {
        feedbackDrafts: {
          ...state.feedbackDrafts,
          [taskId]: {
            ...draft,
            steps: draft.steps.filter(
              (step) => step.id !== stepId,
            ),
          },
        },
      };
    });
  },

  completeFeedback: (taskId) => {
    const state = get();
    const currentTask = state.playlist[0];
    const draft = state.feedbackDrafts[taskId];

    if (
      currentTask?.id !== taskId ||
      !draft ||
      !canCompleteFeedback(draft)
    ) {
      return null;
    }

    const result = getFeedbackCompletionResult(
      state.playlist.length,
    );

    set((current) => {
      const feedbackDrafts = {
        ...current.feedbackDrafts,
      };

      delete feedbackDrafts[taskId];

      const updatedCurrentTask = {
        ...current.playlist[0],
        progressRate: draft.progressTouched
          ? draft.progress
          : current.playlist[0].progressRate,
      };

      return {
        playlist:
          result === "advanced"
            ? current.playlist.slice(1)
            : [
                updatedCurrentTask,
                ...current.playlist.slice(1),
              ],
        feedbackDrafts,
        ...EMPTY_PLAYLIST_TIMER_STATE,
      };
    });

    return result;
  },
});

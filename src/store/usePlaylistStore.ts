import { create } from "zustand";

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
import {
  appendFeedbackStep,
  canCompleteFeedback,
  createDefaultFeedbackSteps,
  createFeedbackDraft,
  getFeedbackCompletionResult,
} from "@/utils/taskFeedback";
import {
  hasCurrentPlaylistTaskChanged,
  selectPlaylistTask,
} from "./playlistSelection";
import { getElapsedSeconds } from "../utils/taskTimer";

interface PlaylistState {
  playlist: PlaylistTask[];
  feedbackDrafts: Record<
    string,
    TaskFeedbackDraft
  >;
  elapsedSeconds: number;
  startedAt: number | null;
  isPlaying: boolean;
  hasStarted: boolean;
  hasSeenCompletionTooltip: boolean;

  replacePlaylist: (
    playlist: PlaylistTask[],
  ) => void;

  addCombination: (
    combination: TaskCombination,
  ) => void;

  removeCombination: (
    modeId: CombinationModeId,
  ) => void;

  removeTasks: (
    taskIds: string[],
  ) => void;

  clearPlaylist: () => void;
  completeCurrentTask: () => void;

  selectTask: (
    taskId: string,
  ) => void;

  reorderTask: (
    activeTaskId: string,
    overTaskId: string,
  ) => void;

  isCombinationAdded: (
    modeId: CombinationModeId,
  ) => boolean;

  playCurrentTask: (
    now?: number,
  ) => void;

  pauseCurrentTask: (
    now?: number,
  ) => void;

  dismissCompletionTooltip: () => void;

  ensureFeedbackDraft: (
    taskId: string,
  ) => void;

  updateFeedbackMemo: (
    taskId: string,
    memo: string,
  ) => void;

  updateFeedbackProgress: (
    taskId: string,
    progress: number,
  ) => void;

  splitFeedbackIntoSteps: (
    taskId: string,
  ) => void;

  addFeedbackStep: (
    taskId: string,
  ) => void;

  updateFeedbackStep: (
    taskId: string,
    stepId: string,
    update: Partial<
      Pick<
        FeedbackStep,
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

const EMPTY_PLAYLIST_TIMER_STATE = {
  elapsedSeconds: 0,
  startedAt: null,
  isPlaying: false,
  hasStarted: false,
} as const;

export const usePlaylistStore =
  create<PlaylistState>(
    (set, get) => ({
      playlist: [],
      feedbackDrafts: {},
      elapsedSeconds: 0,
      startedAt: null,
      isPlaying: false,
      hasStarted: false,
      hasSeenCompletionTooltip: false,

      replacePlaylist: (
        playlist,
      ) => {
        set((state) => ({
          playlist,

          ...(hasCurrentPlaylistTaskChanged(
            state.playlist,
            playlist,
          )
            ? EMPTY_PLAYLIST_TIMER_STATE
            : {}),
        }));
      },

      addCombination: (
        combination,
      ) => {
        const isAlreadyAdded =
          get().playlist.some(
            (task) =>
              task.sourceModeId ===
              combination.id,
          );

        if (
          combination.tasks.length === 0 ||
          isAlreadyAdded
        ) {
          return;
        }

        set((state) => ({
          playlist: [
            ...state.playlist,

            ...combination.tasks.map(
              (task) => ({
                ...task,
                sourceModeId:
                  combination.id,
              }),
            ),
          ],

          ...(state.playlist.length === 0
            ? EMPTY_PLAYLIST_TIMER_STATE
            : {}),
        }));
      },

      removeCombination: (
        modeId,
      ) => {
        set((state) => {
          const playlist =
            state.playlist.filter(
              (task) =>
                task.sourceModeId !==
                modeId,
            );

          return {
            playlist,

            ...(hasCurrentPlaylistTaskChanged(
              state.playlist,
              playlist,
            )
              ? EMPTY_PLAYLIST_TIMER_STATE
              : {}),
          };
        });
      },

      removeTasks: (
        taskIds,
      ) => {
        const taskIdSet =
          new Set(taskIds);

        set((state) => {
          const playlist =
            state.playlist.filter(
              (task) =>
                !taskIdSet.has(
                  task.id,
                ),
            );

          return {
            playlist,

            ...(hasCurrentPlaylistTaskChanged(
              state.playlist,
              playlist,
            )
              ? EMPTY_PLAYLIST_TIMER_STATE
              : {}),
          };
        });
      },

      clearPlaylist: () => {
        set({
          playlist: [],
          ...EMPTY_PLAYLIST_TIMER_STATE,
        });
      },

      completeCurrentTask: () => {
        set((state) => ({
          playlist:
            state.playlist.slice(1),
          ...EMPTY_PLAYLIST_TIMER_STATE,
        }));
      },

      selectTask: (
        taskId,
      ) => {
        set((state) => {
          const playlist =
            selectPlaylistTask(
              state.playlist,
              taskId,
            );

          if (
            playlist === state.playlist
          ) {
            return state;
          }

          return {
            playlist,
            ...EMPTY_PLAYLIST_TIMER_STATE,
          };
        });
      },

      reorderTask: (
        activeTaskId,
        overTaskId,
      ) => {
        if (
          activeTaskId === overTaskId
        ) {
          return;
        }

        set((state) => {
          const activeIndex =
            state.playlist.findIndex(
              (task) =>
                task.id ===
                activeTaskId,
            );

          const overIndex =
            state.playlist.findIndex(
              (task) =>
                task.id ===
                overTaskId,
            );

          if (
            activeIndex < 0 ||
            overIndex < 0
          ) {
            return state;
          }

          const playlist = [
            ...state.playlist,
          ];

          const [activeTask] =
            playlist.splice(
              activeIndex,
              1,
            );

          playlist.splice(
            overIndex,
            0,
            activeTask,
          );

          return {
            playlist,

            ...(hasCurrentPlaylistTaskChanged(
              state.playlist,
              playlist,
            )
              ? EMPTY_PLAYLIST_TIMER_STATE
              : {}),
          };
        });
      },

      isCombinationAdded: (
        modeId,
      ) =>
        get().playlist.some(
          (task) =>
            task.sourceModeId ===
            modeId,
        ),

      playCurrentTask: (
        now = Date.now(),
      ) => {
        const state = get();

        if (
          state.playlist.length ===
            0 ||
          state.isPlaying
        ) {
          return;
        }

        set({
          startedAt: now,
          isPlaying: true,
          hasStarted: true,
        });
      },

      pauseCurrentTask: (
        now = Date.now(),
      ) => {
        const state = get();

        if (!state.isPlaying) {
          return;
        }

        set({
          elapsedSeconds:
            getElapsedSeconds(
              state.elapsedSeconds,
              state.startedAt,
              true,
              now,
            ),
          startedAt: null,
          isPlaying: false,
        });
      },

      dismissCompletionTooltip:
        () => {
          set({
            hasSeenCompletionTooltip:
              true,
          });
        },

      ensureFeedbackDraft: (
        taskId,
      ) => {
        const state = get();

        if (
          state.feedbackDrafts[
            taskId
          ]
        ) {
          return;
        }

        const task =
          state.playlist.find(
            (item) =>
              item.id === taskId,
          );

        if (!task) {
          return;
        }

        set((current) => ({
          feedbackDrafts: {
            ...current.feedbackDrafts,

            [taskId]:
              createFeedbackDraft(
                task.progressRate,
              ),
          },
        }));
      },

      updateFeedbackMemo: (
        taskId,
        memo,
      ) => {
        set((state) => {
          const draft =
            state.feedbackDrafts[
              taskId
            ];

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

      updateFeedbackProgress: (
        taskId,
        progress,
      ) => {
        set((state) => {
          const draft =
            state.feedbackDrafts[
              taskId
            ];

          if (!draft) {
            return state;
          }

          return {
            feedbackDrafts: {
              ...state.feedbackDrafts,

              [taskId]: {
                ...draft,
                progress,
                progressTouched:
                  true,
              },
            },
          };
        });
      },

      splitFeedbackIntoSteps: (
        taskId,
      ) => {
        set((state) => {
          const draft =
            state.feedbackDrafts[
              taskId
            ];

          if (
            !draft ||
            draft.steps.length > 0
          ) {
            return state;
          }

          return {
            feedbackDrafts: {
              ...state.feedbackDrafts,

              [taskId]: {
                ...draft,
                steps:
                  createDefaultFeedbackSteps(),
              },
            },
          };
        });
      },

      addFeedbackStep: (
        taskId,
      ) => {
        set((state) => {
          const draft =
            state.feedbackDrafts[
              taskId
            ];

          if (
            !draft ||
            draft.steps.length === 0
          ) {
            return state;
          }

          return {
            feedbackDrafts: {
              ...state.feedbackDrafts,

              [taskId]: {
                ...draft,
                steps:
                  appendFeedbackStep(
                    draft.steps,
                  ),
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
          const draft =
            state.feedbackDrafts[
              taskId
            ];

          if (!draft) {
            return state;
          }

          return {
            feedbackDrafts: {
              ...state.feedbackDrafts,

              [taskId]: {
                ...draft,

                steps:
                  draft.steps.map(
                    (step) =>
                      step.id ===
                      stepId
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

      removeFeedbackStep: (
        taskId,
        stepId,
      ) => {
        set((state) => {
          const draft =
            state.feedbackDrafts[
              taskId
            ];

          if (!draft) {
            return state;
          }

          return {
            feedbackDrafts: {
              ...state.feedbackDrafts,

              [taskId]: {
                ...draft,

                steps:
                  draft.steps.filter(
                    (step) =>
                      step.id !==
                      stepId,
                  ),
              },
            },
          };
        });
      },

      completeFeedback: (
        taskId,
      ) => {
        const state = get();

        const currentTask =
          state.playlist[0];

        const draft =
          state.feedbackDrafts[
            taskId
          ];

        if (
          currentTask?.id !==
            taskId ||
          !draft ||
          !canCompleteFeedback(
            draft,
          )
        ) {
          return null;
        }

        const result =
          getFeedbackCompletionResult(
            state.playlist.length,
          );

        set((current) => {
          const feedbackDrafts = {
            ...current.feedbackDrafts,
          };

          delete feedbackDrafts[
            taskId
          ];

          const updatedCurrentTask =
            {
              ...current.playlist[0],

              progressRate:
                draft.progressTouched
                  ? draft.progress
                  : current
                      .playlist[0]
                      .progressRate,
            };

          return {
            playlist:
              result === "advanced"
                ? current.playlist.slice(
                    1,
                  )
                : [
                    updatedCurrentTask,
                    ...current.playlist.slice(
                      1,
                    ),
                  ],

            feedbackDrafts,
            ...EMPTY_PLAYLIST_TIMER_STATE,
          };
        });

        return result;
      },
    }),
  );

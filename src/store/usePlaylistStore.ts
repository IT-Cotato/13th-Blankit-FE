import { create } from "zustand";

import type {
  CombinationModeId,
  PlaylistTask,
  TaskCombination,
} from "@/types/taskCombination";
import { getElapsedSeconds } from "../utils/taskTimer";

interface PlaylistState {
  playlist: PlaylistTask[];
  elapsedSeconds: number;
  startedAt: number | null;
  isPlaying: boolean;
  hasStarted: boolean;
  hasSeenCompletionTooltip: boolean;
  addCombination: (combination: TaskCombination) => void;
  removeCombination: (modeId: CombinationModeId) => void;
  removeTasks: (taskIds: string[]) => void;
  clearPlaylist: () => void;
  completeCurrentTask: () => void;
  reorderTask: (activeTaskId: string, overTaskId: string) => void;
  isCombinationAdded: (modeId: CombinationModeId) => boolean;
  playCurrentTask: (now?: number) => void;
  pauseCurrentTask: (now?: number) => void;
  dismissCompletionTooltip: () => void;
}

const EMPTY_PLAYLIST_TIMER_STATE = {
  elapsedSeconds: 0,
  startedAt: null,
  isPlaying: false,
  hasStarted: false,
} as const;

export const usePlaylistStore = create<PlaylistState>(
  (set, get) => ({
    playlist: [],
    elapsedSeconds: 0,
    startedAt: null,
    isPlaying: false,
    hasStarted: false,
    hasSeenCompletionTooltip: false,

    addCombination: (combination) => {
      const isAlreadyAdded = get().playlist.some(
        (task) => task.sourceModeId === combination.id,
      );

      if (combination.tasks.length === 0 || isAlreadyAdded) {
        return;
      }

      set((state) => ({
        playlist: [
          ...state.playlist,
          ...combination.tasks.map((task) => ({
            ...task,
            sourceModeId: combination.id,
          })),
        ],
        ...(state.playlist.length === 0
          ? EMPTY_PLAYLIST_TIMER_STATE
          : {}),
      }));
    },

    removeCombination: (modeId) => {
      set((state) => {
        const playlist = state.playlist.filter(
          (task) => task.sourceModeId !== modeId,
        );

        return {
          playlist,
          ...(playlist.length === 0
            ? EMPTY_PLAYLIST_TIMER_STATE
            : {}),
        };
      });
    },

    removeTasks: (taskIds) => {
      const taskIdSet = new Set(taskIds);

      set((state) => {
        const playlist = state.playlist.filter(
          (task) => !taskIdSet.has(task.id),
        );

        return {
          playlist,
          ...(playlist.length === 0
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
      set((state) => {
        const playlist = state.playlist.slice(1);

        return {
          playlist,
          ...(playlist.length === 0
            ? EMPTY_PLAYLIST_TIMER_STATE
            : {}),
        };
      });
    },

    reorderTask: (activeTaskId, overTaskId) => {
      if (activeTaskId === overTaskId) {
        return;
      }

      set((state) => {
        const activeIndex = state.playlist.findIndex(
          (task) => task.id === activeTaskId,
        );
        const overIndex = state.playlist.findIndex(
          (task) => task.id === overTaskId,
        );

        if (activeIndex < 0 || overIndex < 0) {
          return state;
        }

        const playlist = [...state.playlist];
        const [activeTask] = playlist.splice(activeIndex, 1);
        playlist.splice(overIndex, 0, activeTask);

        return { playlist };
      });
    },

    isCombinationAdded: (modeId) =>
      get().playlist.some(
        (task) => task.sourceModeId === modeId,
      ),

    playCurrentTask: (now = Date.now()) => {
      const state = get();

      if (state.playlist.length === 0 || state.isPlaying) {
        return;
      }

      set({
        startedAt: now,
        isPlaying: true,
        hasStarted: true,
      });
    },

    pauseCurrentTask: (now = Date.now()) => {
      const state = get();

      if (!state.isPlaying) {
        return;
      }

      set({
        elapsedSeconds: getElapsedSeconds(
          state.elapsedSeconds,
          state.startedAt,
          true,
          now,
        ),
        startedAt: null,
        isPlaying: false,
      });
    },

    dismissCompletionTooltip: () => {
      set({ hasSeenCompletionTooltip: true });
    },
  }),
);

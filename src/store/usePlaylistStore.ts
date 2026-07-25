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
  addCombination: (combination: TaskCombination) => void;
  removeCombination: (modeId: CombinationModeId) => void;
  isCombinationAdded: (modeId: CombinationModeId) => boolean;
  playCurrentTask: (now?: number) => void;
  pauseCurrentTask: (now?: number) => void;
}

export const usePlaylistStore = create<PlaylistState>(
  (set, get) => ({
    playlist: [],
    elapsedSeconds: 0,
    startedAt: null,
    isPlaying: false,

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
          ? {
              elapsedSeconds: 0,
              startedAt: null,
              isPlaying: false,
            }
          : {}),
      }));
    },

    removeCombination: (modeId) => {
      set((state) => {
        const playlist = state.playlist.filter(
          (task) => task.sourceModeId !== modeId,
        );
        const didCurrentTaskChange =
          state.playlist[0]?.id !== playlist[0]?.id;

        return {
          playlist,
          ...(didCurrentTaskChange
            ? {
                elapsedSeconds: 0,
                startedAt: null,
                isPlaying: false,
              }
            : {}),
        };
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
  }),
);

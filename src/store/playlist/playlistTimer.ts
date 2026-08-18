import { getElapsedSeconds } from "@/utils/taskTimer";

import type {
  PlaylistStoreCreator,
  PlaylistTimerState,
} from "@/store/playlist/playlistTypes";

export const EMPTY_CURRENT_TASK_TIMER_STATE = {
  elapsedSeconds: 0,
  startedAt: null,
  isPlaying: false,
  hasStarted: false,
} as const;

export const EMPTY_PLAYLIST_TIMER_STATE = {
  ...EMPTY_CURRENT_TASK_TIMER_STATE,
  accumulatedElapsedSeconds: 0,
} as const;

export const createPlaylistTimer: PlaylistStoreCreator<
  PlaylistTimerState
> = (set, get) => ({
  ...EMPTY_PLAYLIST_TIMER_STATE,
  hasSeenCompletionTooltip: false,

  restoreTimerFromSession: (
    elapsedSeconds,
    isPlaying,
    now = Date.now(),
  ) => {
    const safeElapsedSeconds = Number.isFinite(
      elapsedSeconds,
    )
      ? Math.max(0, Math.floor(elapsedSeconds))
      : 0;

    set((state) => ({
      elapsedSeconds: safeElapsedSeconds,
      accumulatedElapsedSeconds:
        state.accumulatedElapsedSeconds === 0
          ? safeElapsedSeconds
          : state.accumulatedElapsedSeconds,
      startedAt: isPlaying ? now : null,
      isPlaying,
      hasStarted:
        isPlaying || safeElapsedSeconds > 0,
    }));
  },

  syncDailyElapsedSeconds: (
    elapsedSeconds,
    resetRunningSegment = false,
    now = Date.now(),
  ) => {
    const safeElapsedSeconds = Number.isFinite(
      elapsedSeconds,
    )
      ? Math.max(0, Math.floor(elapsedSeconds))
      : 0;

    set((state) => ({
      accumulatedElapsedSeconds: safeElapsedSeconds,
      ...(resetRunningSegment && state.isPlaying
        ? { startedAt: now }
        : {}),
    }));
  },

  playCurrentTask: (now = Date.now()) => {
    const state = get();

    if (
      state.playlist.length === 0 ||
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

  pauseCurrentTask: (now = Date.now()) => {
    const state = get();

    if (!state.isPlaying) {
      return;
    }

    const runningSeconds = getElapsedSeconds(
      0,
      state.startedAt,
      true,
      now,
    );

    set({
      elapsedSeconds: getElapsedSeconds(
        state.elapsedSeconds,
        state.startedAt,
        true,
        now,
      ),
      accumulatedElapsedSeconds:
        state.accumulatedElapsedSeconds + runningSeconds,
      startedAt: null,
      isPlaying: false,
    });
  },

  dismissCompletionTooltip: () => {
    set({
      hasSeenCompletionTooltip: true,
    });
  },
});

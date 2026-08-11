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

    set({
      elapsedSeconds: safeElapsedSeconds,
      startedAt: isPlaying ? now : null,
      isPlaying,
      hasStarted:
        isPlaying || safeElapsedSeconds > 0,
    });
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
    set({
      hasSeenCompletionTooltip: true,
    });
  },
});

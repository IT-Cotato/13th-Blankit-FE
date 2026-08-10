import { getElapsedSeconds } from "@/utils/taskTimer";

import type {
  PlaylistStoreCreator,
  PlaylistTimerState,
} from "@/store/playlist/playlistTypes";

export const EMPTY_PLAYLIST_TIMER_STATE = {
  elapsedSeconds: 0,
  startedAt: null,
  isPlaying: false,
  hasStarted: false,
} as const;

export const createPlaylistTimer: PlaylistStoreCreator<
  PlaylistTimerState
> = (set, get) => ({
  ...EMPTY_PLAYLIST_TIMER_STATE,
  hasSeenCompletionTooltip: false,

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

import {
  hasCurrentPlaylistTaskChanged,
  selectPlaylistTask,
} from "@/store/playlistSelection";
import {
  EMPTY_CURRENT_TASK_TIMER_STATE,
  EMPTY_PLAYLIST_TIMER_STATE,
} from "@/store/playlist/playlistTimer";
import { getElapsedSeconds } from "@/utils/taskTimer";

import type {
  PlaylistStoreCreator,
  PlaylistTasksState,
} from "@/store/playlist/playlistTypes";

export const createPlaylistTasks: PlaylistStoreCreator<
  PlaylistTasksState
> = (set) => ({
  playlist: [],

  replacePlaylist: (playlist) => {
    set((state) => ({
      playlist,
      ...(hasCurrentPlaylistTaskChanged(
        state.playlist,
        playlist,
      )
        ? playlist.length === 0 ||
          state.playlist.length === 0
          ? EMPTY_PLAYLIST_TIMER_STATE
          : EMPTY_CURRENT_TASK_TIMER_STATE
        : {}),
    }));
  },

  removeTasks: (taskIds) => {
    const taskIdSet = new Set(taskIds);

    set((state) => {
      const playlist = state.playlist.filter(
        (task) => !taskIdSet.has(task.id),
      );

      return {
        playlist,
        ...(hasCurrentPlaylistTaskChanged(
          state.playlist,
          playlist,
        )
          ? playlist.length === 0
            ? EMPTY_PLAYLIST_TIMER_STATE
            : EMPTY_CURRENT_TASK_TIMER_STATE
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

  completeCurrentTask: (now = Date.now()) => {
    set((state) => {
      const playlist = state.playlist.slice(1);
      const runningSeconds =
        getElapsedSeconds(
          0,
          state.startedAt,
          state.isPlaying,
          now,
        );

      return {
        playlist,
        accumulatedElapsedSeconds:
          playlist.length > 0
            ? state.accumulatedElapsedSeconds +
              runningSeconds
            : 0,
        ...EMPTY_CURRENT_TASK_TIMER_STATE,
      };
    });
  },

  selectTask: (taskId) => {
    set((state) => {
      const playlist = selectPlaylistTask(
        state.playlist,
        taskId,
      );

      if (playlist === state.playlist) {
        return state;
      }

      return {
        playlist,
        ...EMPTY_CURRENT_TASK_TIMER_STATE,
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
      const [activeTask] = playlist.splice(
        activeIndex,
        1,
      );

      playlist.splice(overIndex, 0, activeTask);

      return {
        playlist,
        ...(hasCurrentPlaylistTaskChanged(
          state.playlist,
          playlist,
        )
          ? EMPTY_CURRENT_TASK_TIMER_STATE
          : {}),
      };
    });
  },

});

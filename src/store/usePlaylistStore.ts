import { create } from "zustand";

import {
  createPlaylistFeedback,
} from "@/store/playlist/playlistFeedback";
import {
  createPlaylistTasks,
} from "@/store/playlist/playlistTasks";
import {
  createPlaylistTimer,
} from "@/store/playlist/playlistTimer";

import type {
  PlaylistStore,
} from "@/store/playlist/playlistTypes";

export const usePlaylistStore = create<PlaylistStore>()(
  (...store) => ({
    ...createPlaylistTasks(...store),
    ...createPlaylistTimer(...store),
    ...createPlaylistFeedback(...store),
  }),
);

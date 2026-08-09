import {
  useCallback,
} from "react";

import {
  getPlaylist,
} from "@/api/playlist";
import {
  usePlaylistStore,
} from "@/store/usePlaylistStore";
import {
  hydratePlaylist,
} from "@/utils/playlistMapper";

export function usePlaylistSync() {
  const replacePlaylist =
    usePlaylistStore(
      (state) =>
        state.replacePlaylist,
    );

  const refreshPlaylist =
    useCallback(async () => {
      const response =
        await getPlaylist();

      const playlist =
        await hydratePlaylist(
          response,
        );

      replacePlaylist(
        playlist,
      );

      return playlist;
    }, [replacePlaylist]);

  return {
    refreshPlaylist,
  };
}
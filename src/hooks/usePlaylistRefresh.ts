import {
  useCallback,
} from "react";

import {
  getPlaylist,
} from "@/api/playlist";
import { useAuthStore } from "@/store/authStore";
import {
  usePlaylistStore,
} from "@/store/usePlaylistStore";
import {
  hydratePlaylist,
} from "@/utils/playlistMapper";
import {
  canApplyPlaylistRefresh,
  startPlaylistRefresh,
} from "@/utils/playlistRefreshGuard";

export function usePlaylistRefresh() {
  const replacePlaylist =
    usePlaylistStore(
      (state) =>
        state.replacePlaylist,
    );

  const refreshPlaylist =
    useCallback(async () => {
      const requestedUserId =
        useAuthStore.getState().user?.userId;

      if (requestedUserId === undefined) {
        throw new Error(
          "인증된 사용자 정보를 찾을 수 없습니다.",
        );
      }

      const requestId = startPlaylistRefresh();

      const response =
        await getPlaylist();

      const playlist =
        await hydratePlaylist(
          response,
        );

      const authState = useAuthStore.getState();

      if (
        canApplyPlaylistRefresh(
          requestId,
          requestedUserId,
          authState.isAuthenticated,
          authState.user?.userId ?? null,
        )
      ) {
        replacePlaylist(
          playlist,
        );
      }

      return playlist;
    }, [replacePlaylist]);

  return {
    refreshPlaylist,
  };
}

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addPlaylistItems,
  deletePlaylistItem,
} from "@/api/playlist";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { getCombinationPlaylistItems } from "@/utils/taskCombinationPlaylist";

import type { TaskCombination } from "@/types/taskCombination";

interface UseTaskCombinationPlaylistOptions {
  combination: TaskCombination | undefined;
  onShowToast: (message: string) => void;
}

export function useTaskCombinationPlaylist({
  combination,
  onShowToast,
}: UseTaskCombinationPlaylistOptions) {
  const navigate = useNavigate();
  const playlist = usePlaylistStore(
    (state) => state.playlist,
  );
  const removeTasks = usePlaylistStore(
    (state) => state.removeTasks,
  );
  const { refreshPlaylist } = usePlaylistRefresh();
  const [isAddingCombination, setIsAddingCombination] =
    useState(false);
  const [isDeletingCombination, setIsDeletingCombination] =
    useState(false);
  const playlistChangeInFlightRef = useRef(false);
  const playlistRefreshPendingAfterAddRef = useRef(false);
  const playlistWasEmptyBeforeAddRef = useRef(false);

  const isCombinationAdded = combination
    ? playlist.some(
        (task) => task.sourceMode === combination.id,
      )
    : false;

  const addCombinationToPlaylist = useCallback(async () => {
    if (!combination || playlistChangeInFlightRef.current) {
      return;
    }

    const taskIds = [
      ...new Set(
        combination.tasks.map((task) => task.taskId),
      ),
    ];

    if (taskIds.length === 0) {
      onShowToast("추가할 추천 과업이 없습니다.");
      return;
    }

    const shouldRetryPlaylistRefresh =
      playlistRefreshPendingAfterAddRef.current;
    const playlistWasEmpty = shouldRetryPlaylistRefresh
      ? playlistWasEmptyBeforeAddRef.current
      : playlist.length === 0;

    playlistChangeInFlightRef.current = true;
    setIsAddingCombination(true);

    try {
      if (!shouldRetryPlaylistRefresh) {
        await addPlaylistItems({
          taskIds,
          sourceMode: combination.id,
        });
        playlistRefreshPendingAfterAddRef.current = true;
        playlistWasEmptyBeforeAddRef.current =
          playlistWasEmpty;
      }

      await refreshPlaylist();
      playlistRefreshPendingAfterAddRef.current = false;
      playlistWasEmptyBeforeAddRef.current = false;

      if (playlistWasEmpty) {
        navigate("/task-playlist");
      } else {
        onShowToast("재생 목록에 추가되었습니다.");
      }
    } catch {
      onShowToast(
        playlistRefreshPendingAfterAddRef.current
          ? "과업은 추가되었지만 재생 목록을 불러오지 못했습니다."
          : "과업 조합을 재생 목록에 추가하지 못했습니다.",
      );
    } finally {
      playlistChangeInFlightRef.current = false;
      setIsAddingCombination(false);
    }
  }, [
    combination,
    navigate,
    onShowToast,
    playlist.length,
    refreshPlaylist,
  ]);

  const deleteCombinationFromPlaylist = useCallback(
    async () => {
      if (
        !combination ||
        playlistChangeInFlightRef.current
      ) {
        return;
      }

      const combinationPlaylistItems =
        getCombinationPlaylistItems(
          playlist,
          combination.id,
        );

      if (combinationPlaylistItems.length === 0) {
        onShowToast(
          "삭제할 과업 조합을 찾지 못했습니다.",
        );
        return;
      }

      playlistChangeInFlightRef.current = true;
      setIsDeletingCombination(true);

      try {
        const deletionResults = await Promise.allSettled(
          combinationPlaylistItems.map(
            ({ playlistItemId }) =>
              deletePlaylistItem(playlistItemId),
          ),
        );
        const successfullyDeletedTaskIds =
          deletionResults.flatMap((result, index) =>
            result.status === "fulfilled"
              ? [combinationPlaylistItems[index].taskId]
              : [],
          );
        const failedDeletionCount =
          deletionResults.filter(
            (result) => result.status === "rejected",
          ).length;
        let playlistRefreshFailed = false;

        try {
          await refreshPlaylist();
        } catch {
          playlistRefreshFailed = true;
          removeTasks(successfullyDeletedTaskIds);
        }

        if (failedDeletionCount > 0) {
          onShowToast(
            playlistRefreshFailed
              ? "일부 과업을 삭제하지 못했고 재생 목록도 새로 불러오지 못했습니다."
              : "일부 과업을 삭제하지 못했습니다.",
          );
          return;
        }

        if (playlistRefreshFailed) {
          onShowToast(
            "과업은 삭제되었지만 재생 목록을 새로 불러오지 못했습니다.",
          );
          return;
        }

        onShowToast("재생 목록에서 삭제되었습니다.");
      } finally {
        playlistChangeInFlightRef.current = false;
        setIsDeletingCombination(false);
      }
    },
    [
      combination,
      onShowToast,
      playlist,
      refreshPlaylist,
      removeTasks,
    ],
  );

  return {
    isCombinationAdded,
    isAddingCombination,
    isDeletingCombination,
    addCombinationToPlaylist,
    deleteCombinationFromPlaylist,
  };
}

import { useMemo, useState } from "react";

import { deletePlaylistItem } from "@/api/playlist";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { usePlaylistStore } from "@/store/usePlaylistStore";

import type { PlaylistTask } from "@/types/taskCombination";

interface UsePlaylistDeleteOptions {
  playlist: PlaylistTask[];
  savingOrder: boolean;
  deletingSelectedTasks: boolean;
  setDeletingSelectedTasks: (deleting: boolean) => void;
  onShowToast: (message: string) => void;
}

export function usePlaylistDelete({
  playlist,
  savingOrder,
  deletingSelectedTasks,
  setDeletingSelectedTasks,
  onShowToast,
}: UsePlaylistDeleteOptions) {
  const removeTasks = usePlaylistStore(
    (state) => state.removeTasks,
  );
  const { refreshPlaylist } = usePlaylistRefresh();

  const [selectedTaskIds, setSelectedTaskIds] = useState<
    Set<string>
  >(new Set());
  const [showDeleteSelectedDialog, setShowDeleteSelectedDialog] =
    useState(false);
  const validSelectedTaskIds = useMemo(() => {
    const playlistTaskIds = new Set(
      playlist.map((task) => task.id),
    );

    return new Set(
      [...selectedTaskIds].filter((id) =>
        playlistTaskIds.has(id),
      ),
    );
  }, [playlist, selectedTaskIds]);

  const playlistMutationInProgress =
    deletingSelectedTasks || savingOrder;

  const toggleTask = (taskId: string) => {
    if (playlistMutationInProgress) {
      return;
    }

    setSelectedTaskIds((current) => {
      const next = new Set(current);

      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }

      return next;
    });
  };

  const selectAll = (tasks: PlaylistTask[]) => {
    if (playlistMutationInProgress) {
      return;
    }

    setSelectedTaskIds(
      new Set(tasks.map((task) => task.id)),
    );
  };

  const resetSelection = () => {
    setSelectedTaskIds(new Set());
    setShowDeleteSelectedDialog(false);
  };

  const deleteSelected = async () => {
    if (playlistMutationInProgress) {
      return;
    }

    const selectedTasks = playlist.filter((task) =>
      validSelectedTaskIds.has(task.id),
    );
    const deletableTasks = selectedTasks.flatMap((task) =>
      typeof task.playlistItemId === "number"
        ? [
            {
              taskId: task.id,
              playlistItemId: task.playlistItemId,
            },
          ]
        : [],
    );

    if (deletableTasks.length === 0) {
      setShowDeleteSelectedDialog(false);
      onShowToast(
        "삭제할 플레이리스트 과업을 찾지 못했습니다.",
      );
      return;
    }

    setDeletingSelectedTasks(true);

    try {
      const results = await Promise.allSettled(
        deletableTasks.map(({ playlistItemId }) =>
          deletePlaylistItem(playlistItemId),
        ),
      );
      const successfullyDeletedTaskIds = results.flatMap(
        (result, index) =>
          result.status === "fulfilled"
            ? [deletableTasks[index].taskId]
            : [],
      );
      const failedCount = results.filter(
        (result) => result.status === "rejected",
      ).length;
      const missingPlaylistItemIdCount =
        selectedTasks.length - deletableTasks.length;

      let refreshFailed = false;

      try {
        await refreshPlaylist();
      } catch {
        refreshFailed = true;
        removeTasks(successfullyDeletedTaskIds);
      }

      resetSelection();

      if (
        failedCount > 0 ||
        missingPlaylistItemIdCount > 0
      ) {
        onShowToast(
          "일부 과업을 삭제하지 못했습니다.",
        );
        return;
      }

      if (refreshFailed) {
        onShowToast(
          "과업은 삭제되었지만 목록을 새로 불러오지 못했습니다.",
        );
        return;
      }

      onShowToast("재생 목록에서 삭제되었습니다.");
    } catch {
      resetSelection();
      onShowToast(
        "과업 플레이리스트 삭제에 실패했습니다.",
      );
    } finally {
      setDeletingSelectedTasks(false);
    }
  };

  return {
    validSelectedTaskIds,
    showDeleteSelectedDialog,
    playlistMutationInProgress,
    setShowDeleteSelectedDialog,
    toggleTask,
    selectAll,
    resetSelection,
    deleteSelected,
  };
}

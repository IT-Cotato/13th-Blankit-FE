import { useState } from "react";

import { addPlaylistItems } from "@/api/playlist";
import { deleteTask } from "@/api/tasks";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import {
  getTaskErrorCode,
  getTaskErrorMessage,
} from "@/utils/taskError";

interface UseTaskActionsOptions {
  selectedTaskId: number | null;
  clearSelectedTask: () => void;
  notifyTaskChanged: () => void;
  showToast: (message: string) => void;
}

export function useTaskActions({
  selectedTaskId,
  clearSelectedTask,
  notifyTaskChanged,
  showToast,
}: UseTaskActionsOptions) {
  const { refreshPlaylist } = usePlaylistRefresh();

  const [taskPendingDelete, setTaskPendingDelete] =
    useState<number | null>(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] =
    useState(false);

  const addSelectedTaskToPlaylist = async () => {
    if (
      selectedTaskId === null ||
      addingToPlaylist
    ) {
      return;
    }

    try {
      setAddingToPlaylist(true);

      await addPlaylistItems({
        taskIds: [selectedTaskId],
        sourceMode: null,
      });

      clearSelectedTask();

      try {
        await refreshPlaylist();
      } catch (refreshError) {
        console.error(refreshError);

        showToast(
          "재생 목록에 추가되었지만 목록을 새로고침하지 못했습니다.",
        );
        return;
      }

      showToast("재생 목록에 추가되었습니다.");
    } catch (error) {
      console.error(error);

      showToast(
        getTaskErrorMessage(error) ??
          "재생 목록에 추가하지 못했습니다.",
      );
    } finally {
      setAddingToPlaylist(false);
    }
  };

  const requestDelete = () => {
    if (selectedTaskId === null) {
      return;
    }

    setTaskPendingDelete(selectedTaskId);
    clearSelectedTask();
  };

  const confirmDelete = async () => {
    if (
      taskPendingDelete === null ||
      deletingTask
    ) {
      return;
    }

    const taskId = taskPendingDelete;

    try {
      setDeletingTask(true);

      await deleteTask(taskId);

      setTaskPendingDelete(null);
      notifyTaskChanged();

      try {
        await refreshPlaylist();
      } catch (refreshError) {
        console.error(refreshError);
        showToast(
          "과업은 삭제되었지만 플레이리스트를 새로고침하지 못했습니다.",
        );
        return;
      }

      showToast("삭제가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      if (getTaskErrorCode(error) === "TASK_SESSION_ACTIVE") {
        setTaskPendingDelete(null);
        showToast(
          getTaskErrorMessage(error) ??
            "재생 중인 과업은 삭제할 수 없습니다.",
        );
        return;
      }

      showToast(
        getTaskErrorMessage(error) ??
          "과업 삭제에 실패했습니다.",
      );
    } finally {
      setDeletingTask(false);
    }
  };

  const cancelDelete = () => {
    if (deletingTask) {
      return;
    }

    setTaskPendingDelete(null);
  };

  const closeActionSheet = () => {
    if (addingToPlaylist) {
      return;
    }

    clearSelectedTask();
  };

  return {
    deletingTask,
    addingToPlaylist,
    taskPendingDelete,
    addSelectedTaskToPlaylist,
    closeActionSheet,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}

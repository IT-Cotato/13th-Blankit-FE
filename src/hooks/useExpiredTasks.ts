import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  deletePlaylistItem,
  getPlaylist,
} from "@/api/playlist";
import { deleteTask, getTasks } from "@/api/tasks";
import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";
import { getExpiredTasks } from "@/utils/expiredTask";

import type {
  TaskListResponse,
} from "@/types/taskApi";
import type { TaskStatus } from "@/types/task";

const EXPIRED_TASK_DELETE_DELAY_MS = 5000;
const TASK_PAGE_SIZE = 100;

interface UseExpiredTasksOptions {
  enabled: boolean;
  refreshKey: number;
  onOpenTaskEdit: (taskId: number) => Promise<void>;
  onTaskDeleted: () => void;
  onShowToast: (message: string) => void;
}

async function getTasksByStatus(status: TaskStatus) {
  const params = {
    status,
    size: TASK_PAGE_SIZE,
  };
  const firstPage = await getTasks({
    ...params,
    page: 0,
  });
  const remainingPages = await Promise.all(
    Array.from(
      {
        length: Math.max(firstPage.totalPages - 1, 0),
      },
      (_, index) =>
        getTasks({
          ...params,
          page: index + 1,
        }),
    ),
  );

  return [
    ...firstPage.content,
    ...remainingPages.flatMap((page) => page.content),
  ];
}

async function getIncompleteTasks() {
  const [todoTasks, inProgressTasks] = await Promise.all([
    getTasksByStatus("TODO"),
    getTasksByStatus("IN_PROGRESS"),
  ]);
  const tasksById = new Map<number, TaskListResponse>();

  [...todoTasks, ...inProgressTasks].forEach((task) => {
    tasksById.set(task.taskId, task);
  });

  return [...tasksById.values()];
}

export function useExpiredTasks({
  enabled,
  refreshKey,
  onOpenTaskEdit,
  onTaskDeleted,
  onShowToast,
}: UseExpiredTasksOptions) {
  const { refreshPlaylist } = usePlaylistRefresh();
  const [expiredTasks, setExpiredTasks] = useState<
    TaskListResponse[]
  >([]);
  const [isOpeningTaskEdit, setIsOpeningTaskEdit] =
    useState(false);
  const ignoredTaskIdsRef = useRef(new Set<number>());
  const deletingTaskRef = useRef(false);
  const onOpenTaskEditRef = useRef(onOpenTaskEdit);
  const onTaskDeletedRef = useRef(onTaskDeleted);
  const onShowToastRef = useRef(onShowToast);

  useEffect(() => {
    onOpenTaskEditRef.current = onOpenTaskEdit;
    onTaskDeletedRef.current = onTaskDeleted;
    onShowToastRef.current = onShowToast;
  }, [onOpenTaskEdit, onShowToast, onTaskDeleted]);

  const currentExpiredTask =
    enabled && !isOpeningTaskEdit
    ? expiredTasks[0] ?? null
    : null;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadExpiredTasks = async () => {
      try {
        const incompleteTasks = await getIncompleteTasks();

        if (cancelled) {
          return;
        }

        setExpiredTasks(
          getExpiredTasks(incompleteTasks).filter(
            (task) =>
              !ignoredTaskIdsRef.current.has(task.taskId),
          ),
        );
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          onShowToastRef.current(
            "마감일이 지난 과업을 확인하지 못했습니다.",
          );
        }
      }
    };

    void loadExpiredTasks();

    return () => {
      cancelled = true;
    };
  }, [enabled, refreshKey]);

  const finishCurrentTask = useCallback(
    (taskId: number) => {
      ignoredTaskIdsRef.current.add(taskId);
      setExpiredTasks((current) =>
        current.filter((task) => task.taskId !== taskId),
      );
    },
    [],
  );

  const deleteCurrentExpiredTask = useCallback(async () => {
    if (
      !currentExpiredTask ||
      deletingTaskRef.current
    ) {
      return;
    }

    const taskId = currentExpiredTask.taskId;
    deletingTaskRef.current = true;

    try {
      const playlist = await getPlaylist();
      const matchingPlaylistItems = playlist.items.filter(
        (item) =>
          item.taskId === taskId,
      );

      await Promise.all(
        matchingPlaylistItems.map((item) =>
          deletePlaylistItem(item.playlistItemId),
        ),
      );

      await deleteTask(taskId);
      finishCurrentTask(taskId);
      onTaskDeletedRef.current();

      try {
        await refreshPlaylist();
      } catch (refreshError) {
        console.error(refreshError);
        onShowToastRef.current(
          "과업은 삭제되었지만 재생 목록을 새로 불러오지 못했습니다.",
        );
      }
    } catch (error) {
      console.error(error);
      finishCurrentTask(taskId);
      onShowToastRef.current(
        "마감일이 지난 과업을 삭제하지 못했습니다.",
      );
    } finally {
      deletingTaskRef.current = false;
    }
  }, [
    currentExpiredTask,
    finishCurrentTask,
    refreshPlaylist,
  ]);

  useEffect(() => {
    if (!enabled || !currentExpiredTask) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void deleteCurrentExpiredTask();
    }, EXPIRED_TASK_DELETE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    currentExpiredTask,
    deleteCurrentExpiredTask,
    enabled,
  ]);

  const extendCurrentTaskDeadline = useCallback(async () => {
    if (!currentExpiredTask) {
      return;
    }

    const taskId = currentExpiredTask.taskId;
    setIsOpeningTaskEdit(true);
    finishCurrentTask(taskId);

    try {
      await onOpenTaskEditRef.current(taskId);
    } finally {
      setIsOpeningTaskEdit(false);
    }
  }, [
    currentExpiredTask,
    finishCurrentTask,
  ]);

  return {
    currentExpiredTask,
    extendCurrentTaskDeadline,
  };
}

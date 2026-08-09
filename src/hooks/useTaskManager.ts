import axios from "axios";
import {
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import {
  addPlaylistItems,
} from "@/api/playlist";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskFormOptions,
  updateTask as updateTaskApi,
} from "@/api/tasks";

import type {
  TaskFormHandle,
} from "@/components/task-create/TaskForm";

import { usePlaylistRefresh } from "@/hooks/usePlaylistRefresh";

import type {
  TaskCreateRequest,
  TaskDetailResponse,
  TaskFormOptionsResponse,
  TaskUpdateRequest,
} from "@/types/taskApi";

interface UseTaskManagerOptions {
  showToast: (
    message: string,
  ) => void;
}

interface ApiErrorResponse {
  message?: string;
}

export function useTaskManager({
  showToast,
}: UseTaskManagerOptions) {
  const taskFormRef =
    useRef<TaskFormHandle>(null);

  const { refreshPlaylist } = usePlaylistRefresh();

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<number | null>(
    null,
  );

  const [
    editingTask,
    setEditingTask,
  ] =
    useState<TaskDetailResponse | null>(
      null,
    );

  const [
    loadingTaskDetail,
    setLoadingTaskDetail,
  ] = useState(false);

  const [
    taskPendingDelete,
    setTaskPendingDelete,
  ] = useState<number | null>(
    null,
  );

  const [
    deletingTask,
    setDeletingTask,
  ] = useState(false);

  const [
    addingToPlaylist,
    setAddingToPlaylist,
  ] = useState(false);

  const [
    taskDataVersion,
    setTaskDataVersion,
  ] = useState(0);

  const [
    taskTitle,
    setTaskTitle,
  ] = useState("");

  const [
    isComposerOpen,
    setIsComposerOpen,
  ] = useState(false);

  const [
    taskFormOptions,
    setTaskFormOptions,
  ] =
    useState<TaskFormOptionsResponse | null>(
      null,
    );

  const [
    openingComposer,
    setOpeningComposer,
  ] = useState(false);

  function getServerMessage(
    error: unknown,
  ) {
    return axios.isAxiosError<
      ApiErrorResponse
    >(error)
      ? error.response?.data
          ?.message
      : undefined;
  }

  async function openComposer() {
    if (openingComposer) {
      return;
    }

    try {
      setOpeningComposer(true);

      const formOptions =
        await getTaskFormOptions();

      flushSync(() => {
        setTaskFormOptions(
          formOptions,
        );
        setEditingTask(null);
        setSelectedTaskId(null);
        setTaskTitle("");
        setIsComposerOpen(true);
      });

      taskFormRef.current?.focus();
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "과업 등록 정보를 불러오지 못했습니다.",
      );
    } finally {
      setOpeningComposer(false);
    }
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setEditingTask(null);
    setTaskTitle("");
  }

  async function completeCreate(
    request: TaskCreateRequest,
  ) {
    try {
      await createTask(request);

      setTaskDataVersion(
        (current) =>
          current + 1,
      );

      closeComposer();

      showToast(
        "과업 추가가 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "과업 추가에 실패했습니다.",
      );
    }
  }

  async function editSelectedTask() {
    if (
      selectedTaskId === null ||
      loadingTaskDetail
    ) {
      return;
    }

    try {
      setLoadingTaskDetail(true);

      const [
        taskDetail,
        formOptions,
      ] = await Promise.all([
        getTask(selectedTaskId),
        getTaskFormOptions(),
      ]);

      flushSync(() => {
        setSelectedTaskId(null);
        setEditingTask(taskDetail);
        setTaskFormOptions(
          formOptions,
        );
        setTaskTitle(
          taskDetail.title,
        );
        setIsComposerOpen(true);
      });

      taskFormRef.current?.focus();
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "과업 정보를 불러오지 못했습니다.",
      );
    } finally {
      setLoadingTaskDetail(false);
    }
  }

  async function updateTask(
    taskId: number,
    request: TaskUpdateRequest,
  ) {
    try {
      await updateTaskApi(
        taskId,
        request,
      );

      closeComposer();

      setTaskDataVersion(
        (current) =>
          current + 1,
      );

      showToast(
        "수정이 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "과업 수정에 실패했습니다.",
      );
    }
  }

  async function addSelectedTaskToPlaylist() {
    if (
      selectedTaskId === null ||
      addingToPlaylist
    ) {
      return;
    }

    try {
      setAddingToPlaylist(true);

      await addPlaylistItems({
        taskIds: [
          selectedTaskId,
        ],

        sourceMode: null,
      });

      setSelectedTaskId(null);

      try {
        await refreshPlaylist();
      } catch (refreshError) {
        console.error(refreshError);

        showToast(
          "재생 목록에 추가되었지만 목록을 새로고침하지 못했습니다.",
        );
        return;
      }

      showToast(
        "재생 목록에 추가되었습니다.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "재생 목록에 추가하지 못했습니다.",
      );
    } finally {
      setAddingToPlaylist(
        false,
      );
    }
  }

  function requestDelete() {
    if (
      selectedTaskId === null
    ) {
      return;
    }

    setTaskPendingDelete(
      selectedTaskId,
    );

    setSelectedTaskId(null);
  }

  async function confirmDelete() {
    if (
      taskPendingDelete ===
        null ||
      deletingTask
    ) {
      return;
    }

    const taskId =
      taskPendingDelete;

    try {
      setDeletingTask(true);

      await deleteTask(taskId);

      setTaskPendingDelete(null);

      setTaskDataVersion(
        (current) =>
          current + 1,
      );

      showToast(
        "삭제가 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        getServerMessage(error) ??
          "과업 삭제에 실패했습니다.",
      );
    } finally {
      setDeletingTask(false);
    }
  }

  function cancelDelete() {
    if (deletingTask) {
      return;
    }

    setTaskPendingDelete(null);
  }

  function closeActionSheet() {
    if (
      addingToPlaylist
    ) {
      return;
    }

    setSelectedTaskId(null);
  }

  return {
    taskFormOptions,
    openingComposer,
    loadingTaskDetail,
    deletingTask,
    addingToPlaylist,
    taskDataVersion,
    selectedTaskId,
    editingTask,
    taskPendingDelete,
    taskTitle,
    isComposerOpen,
    taskFormRef,

    selectTask:
      setSelectedTaskId,
    setTaskTitle,

    openComposer,
    closeComposer,
    completeCreate,
    editSelectedTask,
    updateTask,

    addSelectedTaskToPlaylist,

    closeActionSheet,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}

export type TaskManager =
  ReturnType<
    typeof useTaskManager
  >;

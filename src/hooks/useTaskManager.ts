import axios from "axios";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { createTask, deleteTask, getTask, getTaskFormOptions, updateTask as updateTaskApi } from "@/api/tasks";

import type { TaskComposerFlowHandle } from "@/components/task-create/TaskComposerFlow";

import { mockTasks } from "@/mocks/tasks";

import type { Task } from "@/types/task";
import type { TaskCreateRequest, TaskDetailResponse, TaskFormOptionsResponse, TaskUpdateRequest } from "@/types/taskApi";

interface UseTaskManagerOptions {
  showToast: (message: string) => void;
}

export function useTaskManager({
  showToast,
}: UseTaskManagerOptions) {
  const composerRef =
    useRef<TaskComposerFlowHandle>(null);

  const [tasks, setTasks] = useState<Task[]>(() => [...mockTasks]);
  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);
  const [editingTask, setEditingTask] =
    useState<TaskDetailResponse | null>(null);
  const [loadingTaskDetail, setLoadingTaskDetail] = 
    useState(false);
  const [taskPendingDelete, setTaskPendingDelete] = 
    useState<number | null>(null);
  const [deletingTask,setDeletingTask] = 
    useState(false);  
  const [taskDataVersion, setTaskDataVersion] = 
    useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [isComposerOpen, setIsComposerOpen] =
    useState(false);
  const [taskFormOptions, setTaskFormOptions] = 
    useState<TaskFormOptionsResponse | null>(null);
  const [ openingComposer, setOpeningComposer] = 
    useState(false);


  async function openComposer() {
    if (openingComposer) {
      return;
    }

    try {
      setOpeningComposer(true);

      const formOptions =
        await getTaskFormOptions();

      flushSync(() => {
        setTaskFormOptions(formOptions);
        setEditingTask(null);
        setSelectedTaskId(null);
        setTaskTitle("");
        setIsComposerOpen(true);
      });

      composerRef.current?.focus();
    } catch (error) {
      console.error(error);
      showToast(
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

      closeComposer();
      showToast(
        "과업 추가가 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      const serverMessage =
        axios.isAxiosError<{
          message?: string;
        }>(error)
          ? error.response?.data?.message
          : undefined;

      showToast(
        serverMessage ??
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

      const [taskDetail, formOptions] =
        await Promise.all([
          getTask(selectedTaskId),
          getTaskFormOptions(),
        ]);

      flushSync(() => {
        setSelectedTaskId(null);
        setEditingTask(taskDetail);
        setTaskFormOptions(formOptions);
        setTaskTitle(taskDetail.title);
        setIsComposerOpen(true);
      });

      composerRef.current?.focus();
    } catch (error) {
      console.error(error);

      const serverMessage =
        axios.isAxiosError<{
          message?: string;
        }>(error)
          ? error.response?.data?.message
          : undefined;

      showToast(
        serverMessage ??
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
        (current) => current + 1,
      );

      showToast(
        "수정이 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      const serverMessage =
        axios.isAxiosError<{
          message?: string;
        }>(error)
          ? error.response?.data?.message
          : undefined;

      showToast(
        serverMessage ??
          "과업 수정에 실패했습니다.",
      );
    }
  }

  function requestDelete() {
    if (selectedTaskId === null) {
      return;
    }

    setTaskPendingDelete(
      selectedTaskId,
    );

    setSelectedTaskId(null);
  }

  async function confirmDelete() {
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

      setTasks((current) =>
        current.filter(
          (task) =>
            task.taskId !== taskId,
        ),
      );

      setTaskPendingDelete(null);

      setTaskDataVersion(
        (current) => current + 1,
      );

      showToast(
        "삭제가 완료되었습니다.",
      );
    } catch (error) {
      console.error(error);

      const serverMessage =
        axios.isAxiosError<{
          message?: string;
        }>(error)
          ? error.response?.data?.message
          : undefined;

      showToast(
        serverMessage ??
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

  return {
    tasks,
    taskFormOptions,
    openingComposer,
    loadingTaskDetail,
    deletingTask,
    taskDataVersion,
    selectedTaskId,
    editingTask,
    taskPendingDelete,
    taskTitle,
    isComposerOpen,
    composerRef,
    selectTask: setSelectedTaskId,
    setTaskTitle,
    openComposer,
    closeComposer,
    completeCreate,
    editSelectedTask,
    updateTask,
    closeActionSheet: () =>
      setSelectedTaskId(null),
    requestDelete,
    cancelDelete,
    confirmDelete
  };
}

export type TaskManager = ReturnType<typeof useTaskManager>;

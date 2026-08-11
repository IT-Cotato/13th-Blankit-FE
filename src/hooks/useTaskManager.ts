import { useState } from "react";

import { useTaskActions } from "@/hooks/useTaskActions";
import { useTaskForm } from "@/hooks/useTaskForm";

interface UseTaskManagerOptions {
  showToast: (message: string) => void;
}

export function useTaskManager({
  showToast,
}: UseTaskManagerOptions) {
  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);
  const [taskDataVersion, setTaskDataVersion] =
    useState(0);

  const clearSelectedTask = () => {
    setSelectedTaskId(null);
  };

  const notifyTaskChanged = () => {
    setTaskDataVersion((current) => current + 1);
  };

  const taskForm = useTaskForm({
    selectedTaskId,
    clearSelectedTask,
    notifyTaskChanged,
    showToast,
  });

  const taskActions = useTaskActions({
    selectedTaskId,
    clearSelectedTask,
    notifyTaskChanged,
    showToast,
  });

  const selectTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    taskForm.prepareTaskForEdit(taskId);
  };

  return {
    taskFormOptions: taskForm.taskFormOptions,
    openingComposer: taskForm.openingComposer,
    loadingTaskDetail: taskForm.loadingTaskDetail,
    editingTaskReady:
      selectedTaskId !== null &&
      taskForm.preparedEditTaskId === selectedTaskId,
    deletingTask: taskActions.deletingTask,
    addingToPlaylist: taskActions.addingToPlaylist,
    taskDataVersion,
    selectedTaskId,
    editingTask: taskForm.editingTask,
    taskPendingDelete: taskActions.taskPendingDelete,
    taskTitle: taskForm.taskTitle,
    isComposerOpen: taskForm.isComposerOpen,
    taskFormRef: taskForm.taskFormRef,

    selectTask,
    setTaskTitle: taskForm.setTaskTitle,

    openComposer: taskForm.openComposer,
    closeComposer: taskForm.closeComposer,
    completeCreate: taskForm.completeCreate,
    editSelectedTask: taskForm.editSelectedTask,
    updateTask: taskForm.updateTask,

    addSelectedTaskToPlaylist:
      taskActions.addSelectedTaskToPlaylist,

    closeActionSheet: taskActions.closeActionSheet,
    requestDelete: taskActions.requestDelete,
    cancelDelete: taskActions.cancelDelete,
    confirmDelete: taskActions.confirmDelete,
  };
}

export type TaskManager = ReturnType<
  typeof useTaskManager
>;

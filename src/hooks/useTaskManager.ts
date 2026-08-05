import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import type { TaskComposerFlowHandle } from "@/components/task-create/TaskComposerFlow";
import { mockTasks } from "@/mocks/tasks";
import type { Task } from "@/types/task";

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
    useState<Task | null>(null);
  const [taskPendingDelete, setTaskPendingDelete] =
    useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [isComposerOpen, setIsComposerOpen] =
    useState(false);

  function openComposer() {
    flushSync(() => {
      setEditingTask(null);
      setSelectedTaskId(null);
      setTaskTitle("");
      setIsComposerOpen(true);
    });

    composerRef.current?.focus();
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setEditingTask(null);
    setTaskTitle("");
  }

  function completeCreate() {
    closeComposer();
    showToast("과업 추가가 완료되었습니다.");
  }

  function editSelectedTask() {
    const selectedTask = tasks.find(
      (task) => task.taskId === selectedTaskId,
    );

    if (!selectedTask) {
      return;
    }

    flushSync(() => {
      setSelectedTaskId(null);
      setEditingTask(selectedTask);
      setTaskTitle(selectedTask.title);
      setIsComposerOpen(true);
    });

    composerRef.current?.focus();
  }

  function updateTask(updatedTask: Task) {
    setTasks((current) =>
      current.map((task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task,
      ),
    );
    closeComposer();
    showToast("수정이 완료되었습니다.");
  }

  function requestDelete() {
    const selectedTask = tasks.find(
      (task) => task.taskId === selectedTaskId,
    );

    setSelectedTaskId(null);

    if (selectedTask) {
      setTaskPendingDelete(selectedTask);
    }
  }

  function confirmDelete() {
    if (!taskPendingDelete) {
      return;
    }

    setTasks((current) =>
      current.filter(
        (task) => task.taskId !== taskPendingDelete.taskId,
      ),
    );
    setTaskPendingDelete(null);
    showToast("삭제가 완료되었습니다.");
  }

  return {
    tasks,
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
    closeActionSheet: () => setSelectedTaskId(null),
    requestDelete,
    cancelDelete: () => setTaskPendingDelete(null),
    confirmDelete,
  };
}

export type TaskManager = ReturnType<typeof useTaskManager>;

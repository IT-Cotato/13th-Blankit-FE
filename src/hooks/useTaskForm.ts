import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import {
  createTask,
  getTask,
  getTaskFormOptions,
  updateTask as updateTaskApi,
} from "@/api/tasks";
import { getTaskErrorMessage } from "@/utils/taskError";
import { openTaskComposerWithOptions } from "@/hooks/taskComposerOpening";

import type { TaskFormHandle } from "@/components/task-create/TaskForm";
import type {
  TaskCreateRequest,
  TaskDetailResponse,
  TaskFormOptionsResponse,
  TaskUpdateRequest,
} from "@/types/taskApi";

interface UseTaskFormOptions {
  selectedTaskId: number | null;
  clearSelectedTask: () => void;
  notifyTaskChanged: () => void;
  showToast: (message: string) => void;
}

export function useTaskForm({
  selectedTaskId,
  clearSelectedTask,
  notifyTaskChanged,
  showToast,
}: UseTaskFormOptions) {
  const taskFormRef = useRef<TaskFormHandle>(null);
  const preparedEditRef = useRef<{
    taskId: number;
    taskDetail: TaskDetailResponse;
    formOptions: TaskFormOptionsResponse;
  } | null>(null);
  const prepareEditRequestIdRef = useRef(0);

  const [editingTask, setEditingTask] =
    useState<TaskDetailResponse | null>(null);
  const [loadingTaskDetail, setLoadingTaskDetail] =
    useState(false);
  const [preparedEditTaskId, setPreparedEditTaskId] =
    useState<number | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [isComposerOpen, setIsComposerOpen] =
    useState(false);
  const [taskFormOptions, setTaskFormOptions] =
    useState<TaskFormOptionsResponse | null>(null);
  const [openingComposer, setOpeningComposer] =
    useState(false);

  const openComposer = async () => {
    if (openingComposer) {
      return;
    }

    try {
      setOpeningComposer(true);

      await openTaskComposerWithOptions({
        openComposer: () => {
          flushSync(() => {
            setTaskFormOptions(null);
            setEditingTask(null);
            clearSelectedTask();
            setTaskTitle("");
            setIsComposerOpen(true);
          });

          taskFormRef.current?.focus();
        },
        loadOptions: getTaskFormOptions,
        applyOptions: setTaskFormOptions,
      });
    } catch (error) {
      console.error(error);

      setIsComposerOpen(false);
      setTaskFormOptions(null);

      showToast(
        getTaskErrorMessage(error) ??
          "과업 등록 정보를 불러오지 못했습니다.",
      );
    } finally {
      setOpeningComposer(false);
    }
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingTask(null);
    setTaskTitle("");
  };

  const completeCreate = async (
    request: TaskCreateRequest,
  ) => {
    try {
      await createTask(request);

      notifyTaskChanged();
      closeComposer();
      showToast("과업 추가가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      showToast(
        getTaskErrorMessage(error) ??
          "과업 추가에 실패했습니다.",
      );
    }
  };

  const prepareTaskForEdit = (taskId: number) => {
    const requestId = prepareEditRequestIdRef.current + 1;
    prepareEditRequestIdRef.current = requestId;
    preparedEditRef.current = null;
    setPreparedEditTaskId(null);
    setLoadingTaskDetail(true);

    void Promise.all([
      getTask(taskId),
      getTaskFormOptions(),
    ])
      .then(([taskDetail, formOptions]) => {
        if (prepareEditRequestIdRef.current !== requestId) {
          return;
        }

        preparedEditRef.current = {
          taskId,
          taskDetail,
          formOptions,
        };
        setPreparedEditTaskId(taskId);
      })
      .catch((error) => {
        if (prepareEditRequestIdRef.current !== requestId) {
          return;
        }

        console.error(error);
        showToast(
          getTaskErrorMessage(error) ??
            "과업 정보를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (prepareEditRequestIdRef.current === requestId) {
          setLoadingTaskDetail(false);
        }
      });
  };

  const editSelectedTask = () => {
    const preparedEdit = preparedEditRef.current;

    if (
      selectedTaskId === null ||
      preparedEdit?.taskId !== selectedTaskId
    ) {
      return;
    }

    flushSync(() => {
      clearSelectedTask();
      setEditingTask(preparedEdit.taskDetail);
      setTaskFormOptions(preparedEdit.formOptions);
      setTaskTitle(preparedEdit.taskDetail.title);
      setIsComposerOpen(true);
    });

    preparedEditRef.current = null;
    setPreparedEditTaskId(null);
    taskFormRef.current?.focus();
  };

  const updateTask = async (
    taskId: number,
    request: TaskUpdateRequest,
  ) => {
    try {
      await updateTaskApi(taskId, request);

      closeComposer();
      notifyTaskChanged();
      showToast("수정이 완료되었습니다.");
    } catch (error) {
      console.error(error);

      showToast(
        getTaskErrorMessage(error) ??
          "과업 수정에 실패했습니다.",
      );
    }
  };

  return {
    taskFormOptions,
    openingComposer,
    loadingTaskDetail,
    preparedEditTaskId,
    editingTask,
    taskTitle,
    isComposerOpen,
    taskFormRef,
    setTaskTitle,
    openComposer,
    closeComposer,
    completeCreate,
    prepareTaskForEdit,
    editSelectedTask,
    updateTask,
  };
}

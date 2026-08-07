import { useState } from "react";

import type { AlarmOption } from "@/components/task-create/alarm/alarmOptions";
import type { RepeatSettings } from "@/components/task-create/date/repeatTypes";
import {
  createTaskRequest,
  createTaskUpdateRequest,
} from "@/components/task-create/utils/taskRequestBuilders";

import type { Category } from "@/types/category";
import type {
  TaskCreateRequest,
  TaskDetailResponse,
  TaskUpdateRequest,
} from "@/types/taskApi";

interface UseTaskSubmissionOptions {
  title: string;
  task: TaskDetailResponse | null;
  selectedDate: Date | null;
  repeatSettings: RepeatSettings | null;
  selectedCategory: Category | null;
  selectedAlarm: AlarmOption;
  onCreate: (
    request: TaskCreateRequest,
  ) => void | Promise<void>;
  onUpdate?: (
    taskId: number,
    request: TaskUpdateRequest,
  ) => void | Promise<void>;
}

export function useTaskSubmission({
  title,
  task,
  selectedDate,
  repeatSettings,
  selectedCategory,
  selectedAlarm,
  onCreate,
  onUpdate,
}: UseTaskSubmissionOptions) {
  const [submitting, setSubmitting] =
    useState(false);

  async function submitTask(
    similarTaskId: number | null,
  ) {
    if (
      submitting ||
      !selectedCategory ||
      (!selectedDate && !repeatSettings)
    ) {
      return;
    }

    if (task && onUpdate) {
      const request = createTaskUpdateRequest({
        title,
        selectedDate,
        repeatSettings,
        categoryId: selectedCategory.categoryId,
        alarm: selectedAlarm,
        similarTaskId,
      });

      try {
        setSubmitting(true);
        await onUpdate(task.taskId, request);
      } finally {
        setSubmitting(false);
      }

      return;
    }

    const request = createTaskRequest({
      title,
      selectedDate,
      repeatSettings,
      categoryId: selectedCategory.categoryId,
      alarm: selectedAlarm,
      similarTaskId,
    });

    try {
      setSubmitting(true);
      await onCreate(request);
    } finally {
      setSubmitting(false);
    }
  }

  return {
    submitting,
    submitTask,
  };
}

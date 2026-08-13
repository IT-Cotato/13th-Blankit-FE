import { create } from "zustand";

import type { RecommendedTaskItem } from "@/types/recommendationApi";

interface TaskCompletionStore {
  recommendedTasksSnapshot: RecommendedTaskItem[];
  completedTaskId: number | null;

  rememberRecommendedTasks: (
    tasks: RecommendedTaskItem[],
  ) => void;

  markTaskCompleted: (taskId: number) => void;
  clearTaskCompletion: () => void;
}

export const useTaskCompletionStore =
  create<TaskCompletionStore>((set, get) => ({
    recommendedTasksSnapshot: [],
    completedTaskId: null,

    rememberRecommendedTasks: (tasks) => {
      if (get().completedTaskId !== null) {
        return;
      }

      set({
        recommendedTasksSnapshot: tasks.slice(0, 3),
      });
    },

    markTaskCompleted: (taskId) => {
      set({
        completedTaskId: taskId,
      });
    },

    clearTaskCompletion: () => {
      set({
        completedTaskId: null,
        recommendedTasksSnapshot: [],
      });
    },
  }));
import { apiClient } from "@/api/client";
import { getAllRecommendations } from "@/api/recommendations";
import { getTask } from "@/api/tasks";
import type { ApiEnvelope } from "@/types/auth";
import type { PriorityTask } from "@/types/priority";
import type { TaskDetailResponse } from "@/types/taskApi";

export async function getPriorityTasks(): Promise<PriorityTask[]> {
  const recommendation = await getAllRecommendations();
  const details = await Promise.all(
    recommendation.tasks.map((task) => getTask(task.taskId)),
  );
  const detailByTaskId = new Map(details.map((task) => [task.taskId, task]));

  return recommendation.tasks.map((task) => {
    const detail = detailByTaskId.get(task.taskId);

    if (!detail) {
      throw new Error(`과업 상세 정보를 찾을 수 없습니다: ${task.taskId}`);
    }

    return {
      taskId: task.taskId,
      title: task.title,
      categoryId: detail.category.categoryId,
      categoryName: detail.category.categoryName,
      categoryColor: task.categoryColor,
      priority: task.priority,
      isStarred: detail.starred,
      deadline: detail.deadline,
      estimatedTime: detail.estimatedTime ?? 0,
      status: detail.status,
      progressRate: task.progressRate ?? 0,
      lastMemo: null,
    };
  });
}

export async function updateTaskStar(
  taskId: number,
  isStarred: boolean,
): Promise<TaskDetailResponse> {
  const response = await apiClient.patch<ApiEnvelope<TaskDetailResponse>>(
    `/api/tasks/${taskId}/star`,
    { isStarred },
  );

  return response.data.data;
}

import { getTask } from "@/api/tasks";
import { getCategoryPresentation } from "@/constants/category";

import type { PlaylistResponse } from "@/types/playlistApi";
import type { TaskDetailResponse } from "@/types/taskApi";
import type { PlaylistTask } from "@/types/taskCombination";

export function mapPlaylistResponse(
  response: PlaylistResponse,
  taskDetails: TaskDetailResponse[],
): PlaylistTask[] {
  const detailMap = new Map(
    taskDetails.map((detail) => [detail.taskId, detail]),
  );

  return [...response.items]
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((item) => {
      const detail = detailMap.get(item.taskId);

      if (!detail) {
        throw new Error(
          `과업 상세 정보를 찾을 수 없습니다: ${item.taskId}`,
        );
      }

      const categoryPresentation = getCategoryPresentation(
        detail.category,
      );

      return {
        id: String(item.taskId),
        taskId: item.taskId,
        playlistItemId: item.playlistItemId,
        sourceMode: item.sourceMode,
        title: item.title,
        priority: detail.priority ?? "LOW",
        status: detail.status,
        progressRate: item.progressRate ?? detail.progressRate ?? 0,
        estimatedMinutes: detail.estimatedTime ?? 0,
        categoryId: String(detail.category.categoryId),
        categoryName: detail.category.categoryName,
        categoryIcon: categoryPresentation.icon,
        category: detail.category,
      };
    });
}

export async function hydratePlaylist(
  response: PlaylistResponse,
): Promise<PlaylistTask[]> {
  const taskIds = [
    ...new Set(response.items.map((item) => item.taskId)),
  ];
  const taskDetails = await Promise.all(
    taskIds.map((taskId) => getTask(taskId)),
  );

  return mapPlaylistResponse(response, taskDetails);
}

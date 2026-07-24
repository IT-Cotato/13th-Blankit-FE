import type { CompletedTaskItem } from "@/types/completedTask";

const completedTasksEndpoint =
  import.meta.env.VITE_COMPLETED_TASKS_API_URL ?? "/api/completed-tasks";

function isCompletedTaskItem(value: unknown): value is CompletedTaskItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.taskId === "number" &&
    typeof item.title === "string" &&
    typeof item.categoryId === "number" &&
    typeof item.categoryName === "string" &&
    typeof item.categoryColor === "string" &&
    typeof item.deadline === "string" &&
    typeof item.totalElapsedTime === "number"
  );
}

function extractCompletedTasks(responseBody: unknown): CompletedTaskItem[] {
  const body =
    typeof responseBody === "object" && responseBody !== null
      ? (responseBody as Record<string, unknown>)
      : null;
  const data =
    body && typeof body.data === "object" && body.data !== null
      ? (body.data as Record<string, unknown>)
      : null;
  const items = data && Array.isArray(data.content) ? data.content : null;

  if (!items || !items.every(isCompletedTaskItem)) {
    throw new Error("완료 과업 API 응답 형식이 올바르지 않습니다.");
  }

  return items;
}

export async function fetchCompletedTasks(
  signal?: AbortSignal,
): Promise<CompletedTaskItem[]> {
  const response = await fetch(completedTasksEndpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`완료 과업을 불러오지 못했습니다. (${response.status})`);
  }

  return extractCompletedTasks(await response.json());
}

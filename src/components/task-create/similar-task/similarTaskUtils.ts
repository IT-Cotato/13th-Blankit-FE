import type { Category } from "@/types/category";
import type { Task } from "@/types/task";

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === "DONE");
}

export function getTaskCategories(tasks: Task[]): Category[] {
  const categories = new Map<number, Category>();

  for (const task of getCompletedTasks(tasks)) {
    categories.set(task.category.categoryId, task.category);
  }

  return [...categories.values()];
}

export function filterSimilarTasks(
  tasks: Task[],
  query: string,
  categoryId: number | null,
): Task[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

  return getCompletedTasks(tasks).filter((task) => {
    const matchesCategory =
      categoryId === null || task.category.categoryId === categoryId;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      task.title.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
      task.category.categoryName
        .toLocaleLowerCase("ko-KR")
        .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function formatElapsedMinutes(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}분`;
  }

  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${remainingMinutes}분`;
}

export function formatTaskDeadline(deadline: string): string {
  const [year, month, day] = deadline.split("-").map(Number);

  return `${year}년 ${month}월 ${day}일 완료`;
}

export function toggleSelectedTask(
  selectedTaskId: number | null,
  taskId: number,
): number | null {
  return selectedTaskId === taskId ? null : taskId;
}

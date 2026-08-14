import type { TaskListResponse } from "@/types/taskApi";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getExpiredTasks(
  tasks: TaskListResponse[],
  now = new Date(),
) {
  const today = formatLocalDate(now);

  return tasks.filter(
    (task) =>
      task.status !== "DONE" &&
      Boolean(task.deadline) &&
      task.deadline < today,
  );
}

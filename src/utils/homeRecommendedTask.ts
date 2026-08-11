interface RankedTask {
  taskId: number;
  rankOrder: number;
}

export function formatRecommendedTaskTime(
  minutes: number,
) {
  const safeMinutes = Number.isFinite(minutes)
    ? Math.max(0, Math.floor(minutes))
    : 0;
  const totalSeconds = safeMinutes * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  return [hours, remainingMinutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function getRecommendedTaskIds(
  tasks: RankedTask[],
) {
  const uniqueTaskIds = new Set<number>();

  [...tasks]
    .sort(
      (first, second) =>
        first.rankOrder - second.rankOrder,
    )
    .forEach((task) => {
      if (uniqueTaskIds.size < 3) {
        uniqueTaskIds.add(task.taskId);
      }
    });

  return [...uniqueTaskIds];
}

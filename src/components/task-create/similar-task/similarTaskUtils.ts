export function formatElapsedTime(
  totalElapsedSeconds: number,
): string {
  const safeSeconds = Number.isFinite(
    totalElapsedSeconds,
  )
    ? Math.max(0, Math.floor(totalElapsedSeconds))
    : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );
  const seconds = safeSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}시간`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}분`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}초`);
  }

  return parts.join(" ");
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

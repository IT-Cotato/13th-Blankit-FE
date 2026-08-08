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

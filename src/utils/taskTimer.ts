export function getElapsedSeconds(
  elapsedSeconds: number,
  startedAt: number | null,
  isPlaying: boolean,
  now: number,
) {
  if (!isPlaying || startedAt === null) {
    return Math.max(0, Math.floor(elapsedSeconds));
  }

  const runningSeconds = Math.max(
    0,
    Math.floor((now - startedAt) / 1000),
  );

  return (
    Math.max(0, Math.floor(elapsedSeconds)) +
    runningSeconds
  );
}

export function getTaskProgress(
  elapsedSeconds: number,
  estimatedMinutes: number,
) {
  if (estimatedMinutes <= 0) {
    return 0;
  }

  const estimatedSeconds = estimatedMinutes * 60;
  const progress =
    (Math.max(0, elapsedSeconds) / estimatedSeconds) * 100;

  return Math.min(100, progress);
}

export function formatTimer(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

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
  const safeSeconds = Number.isFinite(seconds)
    ? Math.max(0, Math.floor(seconds))
    : 0;

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );
  const remainingSeconds = safeSeconds % 60;

  const formattedMinutes = String(minutes).padStart(
    2,
    "0",
  );

  const formattedSeconds = String(
    remainingSeconds,
  ).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
}

export interface TaskMosaicState {
  completedSlots: number;
  recommendedSlots: number;
}

export function getTaskMosaicState(
  elapsedSeconds: number,
  estimatedMinutes: number,
  totalSlots = 100,
): TaskMosaicState {
  const safeTotalSlots = Math.max(
    0,
    Math.floor(totalSlots),
  );

  return {
    completedSlots: Math.min(
      safeTotalSlots,
      Math.floor(Math.max(0, elapsedSeconds) / 300),
    ),
    recommendedSlots: Math.min(
      safeTotalSlots,
      Math.ceil(Math.max(0, estimatedMinutes) / 5),
    ),
  };
}

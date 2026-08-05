interface TaskPlayerControlState {
  isPlaying: boolean;
  hasStarted: boolean;
}

export function getTaskPlayerControls({
  isPlaying,
  hasStarted,
}: TaskPlayerControlState) {
  return {
    timerControl: isPlaying ? "pause" : "play",
    taskAction:
      isPlaying || !hasStarted ? "complete" : "exit",
  } as const;
}

import type { TaskSessionStatus } from "@/types/taskSession";

type ChangeSessionStatus = (
  status: TaskSessionStatus,
  elapsedTime: number,
) => Promise<unknown | null>;

export function shouldRestoreTimerFromSession(
  hasStarted: boolean,
) {
  return !hasStarted;
}

export async function updateTimerWithSession(
  status: TaskSessionStatus,
  elapsedTime: number,
  changeSessionStatus: ChangeSessionStatus,
  updateLocalTimer: () => void,
) {
  const updatedSession = await changeSessionStatus(
    status,
    elapsedTime,
  );

  if (!updatedSession) {
    return false;
  }

  updateLocalTimer();
  return true;
}

import type { TaskSessionStatus } from "@/types/taskSession";

type ChangeSessionStatus = (
  status: TaskSessionStatus,
  elapsedTime: number,
) => Promise<unknown | null>;

export function getMissingTaskIdMessage(
  taskId: number | undefined,
) {
  return taskId === undefined
    ? "과업 정보를 확인할 수 없습니다."
    : null;
}

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

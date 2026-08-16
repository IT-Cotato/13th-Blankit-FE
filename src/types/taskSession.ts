export type TaskSessionStatus =
  | "PLAYING"
  | "PAUSED"
  | "DONE";

export interface TaskSessionResponse {
  taskSessionId: number;
  taskId: number;
  startedAt: string;
  endedAt: string | null;
  elapsedTime: number;
  status: TaskSessionStatus;
}

export interface UpdateTaskSessionStatusRequest {
  status: TaskSessionStatus;
  elapsedTime: number;
}
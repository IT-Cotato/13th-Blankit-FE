export interface TaskStepResponse {
  taskStepId: number;
  title: string;
  progressRate: number;
}

export interface CreateTaskStepRequest {
  title: string;
}

export interface UpdateTaskStepRequest {
  title?: string;
  progressRate?: number;
}
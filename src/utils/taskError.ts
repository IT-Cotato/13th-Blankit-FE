import axios from "axios";

interface TaskApiErrorResponse {
  message?: string;
}

export function getTaskErrorMessage(error: unknown) {
  return axios.isAxiosError<TaskApiErrorResponse>(error)
    ? error.response?.data?.message
    : undefined;
}

import axios from "axios";

interface TaskApiErrorResponse {
  code?: string;
  message?: string;
}

export function getTaskErrorCode(error: unknown) {
  return axios.isAxiosError<TaskApiErrorResponse>(error)
    ? error.response?.data?.code
    : undefined;
}

export function getTaskErrorMessage(error: unknown) {
  return axios.isAxiosError<TaskApiErrorResponse>(error)
    ? error.response?.data?.message
    : undefined;
}

import { apiClient } from "@/api/client";
import type { ApiEnvelope } from "@/types/auth";
import type {
  TimetableRequest,
  TimetableResponse,
  TimetableSettingsRequest,
  TimetableSettingsResponse,
  TimetableUpdateRequest,
} from "@/types/timetableApi";

export async function getTimetable(): Promise<TimetableResponse[]> {
  const response = await apiClient.get<ApiEnvelope<TimetableResponse[]>>(
    "/api/timetable",
  );
  return response.data.data;
}

export async function createTimetableEntries(
  payload: TimetableRequest[],
): Promise<TimetableResponse[]> {
  const response = await apiClient.post<ApiEnvelope<TimetableResponse[]>>(
    "/api/timetable",
    payload,
  );
  return response.data.data;
}

export async function importEverytimeTimetable(
  url: string,
): Promise<TimetableResponse[]> {
  const response = await apiClient.post<ApiEnvelope<TimetableResponse[]>>(
    "/api/timetable/import/everytime",
    { url },
  );
  return response.data.data;
}

export async function updateTimetableEntry(
  timetableId: number,
  payload: TimetableUpdateRequest,
): Promise<TimetableResponse> {
  const response = await apiClient.patch<ApiEnvelope<TimetableResponse>>(
    `/api/timetable/${timetableId}`,
    payload,
  );
  return response.data.data;
}

export async function deleteTimetableEntry(timetableId: number): Promise<void> {
  await apiClient.delete(`/api/timetable/${timetableId}`);
}

export async function resetTimetable(): Promise<void> {
  await apiClient.delete("/api/timetable");
}

export async function updateTimetableSettings(
  payload: TimetableSettingsRequest,
): Promise<TimetableSettingsResponse> {
  const response = await apiClient.patch<ApiEnvelope<TimetableSettingsResponse>>(
    "/api/users/me/timetable-settings",
    payload,
  );
  return response.data.data;
}

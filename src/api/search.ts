import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  SearchHistory,
  SearchHistoryParams,
  SearchTaskData,
  SearchTaskParams,
} from "@/types/search";

export async function searchTasks(
  params: SearchTaskParams,
): Promise<SearchTaskData> {
  const response = await apiClient.get<
    ApiEnvelope<SearchTaskData>
  >("/api/search", {
    params,
  });

  return response.data.data;
}

export async function getSearchHistories(
  params: SearchHistoryParams = {},
): Promise<SearchHistory[]> {
  const response = await apiClient.get<
    ApiEnvelope<SearchHistory[]>
  >("/api/search-histories", {
    params,
  });

  return response.data.data;
}

export async function deleteSearchHistory(
  searchHistoryId: number,
): Promise<void> {
  await apiClient.delete(
    `/api/search-histories/${searchHistoryId}`,
  );
}

export async function deleteAllSearchHistories():
Promise<void> {
  await apiClient.delete(
    "/api/search-histories",
  );
}
import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  AllRecommendationResponse,
  TodayRecommendationResponse,
} from "@/types/recommendationApi";

export async function getTodayRecommendation():
Promise<TodayRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<TodayRecommendationResponse>
  >("/api/recommendations/today");

  return response.data.data;
}

export async function getAllRecommendations():
Promise<AllRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<AllRecommendationResponse>
  >("/api/recommendations/all");

  return response.data.data;
}
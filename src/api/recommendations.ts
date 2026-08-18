import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  AllRecommendationResponse,
  RecommendationModesResponse,
  TodayRecommendationResponse,
} from "@/types/recommendationApi";

function createSharedRequest<T>(
  request: () => Promise<T>,
) {
  let pending: Promise<T> | null = null;

  const get = () => {
    if (pending) {
      return pending;
    }

    pending = request().finally(() => {
      pending = null;
    });

    return pending;
  };

  return {
    get,
  };
}

async function requestTodayRecommendation():
Promise<TodayRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<TodayRecommendationResponse>
  >("/api/recommendations/today");

  return response.data.data;
}

async function requestRecommendationModes():
Promise<RecommendationModesResponse> {
  const response = await apiClient.get<
    ApiEnvelope<RecommendationModesResponse>
  >("/api/recommendations/modes");

  return response.data.data;
}

const todayRecommendationRequest = createSharedRequest(
  requestTodayRecommendation,
);

const recommendationModesRequest = createSharedRequest(
  requestRecommendationModes,
);

export async function getTodayRecommendation():
Promise<TodayRecommendationResponse> {
  return todayRecommendationRequest.get();
}

export async function getAllRecommendations():
Promise<AllRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<AllRecommendationResponse>
  >("/api/recommendations/all");

  return response.data.data;
}

export async function getRecommendationModes():
Promise<RecommendationModesResponse> {
  return recommendationModesRequest.get();
}

import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { getKstDateKey } from "@/utils/kstDate";

import type { ApiEnvelope } from "@/types/auth";
import type {
  AllRecommendationResponse,
  RecommendationModesResponse,
  ThirtyMinutePackRecommendationResponse,
  TodayRecommendationResponse,
} from "@/types/recommendationApi";

function createSharedRequest<T>(
  request: () => Promise<T>,
) {
  let pending: {
    key: string;
    promise: Promise<T>;
  } | null = null;

  const get = (key: string) => {
    if (pending?.key === key) {
      return pending.promise;
    }

    const promise = request();
    pending = { key, promise };

    const clearPendingRequest = () => {
      if (pending?.promise === promise) {
        pending = null;
      }
    };

    void promise.then(
      clearPendingRequest,
      clearPendingRequest,
    );

    return promise;
  };

  return {
    get,
  };
}

function getRecommendationRequestKey() {
  const userId =
    useAuthStore.getState().user?.userId ?? "anonymous";

  return `${userId}:${getKstDateKey()}`;
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
  return todayRecommendationRequest.get(
    getRecommendationRequestKey(),
  );
}

export async function getAllRecommendations():
Promise<AllRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<AllRecommendationResponse>
  >("/api/recommendations/all");

  return response.data.data;
}

export async function getThirtyMinutePackRecommendation(
  availableMinutes: number,
): Promise<ThirtyMinutePackRecommendationResponse> {
  const response = await apiClient.get<
    ApiEnvelope<ThirtyMinutePackRecommendationResponse>
  >("/api/recommendations/pack30", {
    params: { availableMinutes },
  });

  return response.data.data;
}

export async function getRecommendationModes():
Promise<RecommendationModesResponse> {
  return recommendationModesRequest.get(
    getRecommendationRequestKey(),
  );
}

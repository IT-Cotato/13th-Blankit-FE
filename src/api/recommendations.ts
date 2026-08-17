import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  AllRecommendationResponse,
  RecommendationModesResponse,
  TodayRecommendationResponse,
} from "@/types/recommendationApi";
import { useAuthStore } from "@/store/authStore";
import { getKstDateKey } from "@/utils/kstDate";

interface DailyRequestCacheEntry<T> {
  dateKey: string;
  hasData: boolean;
  data?: T;
  pending?: Promise<T>;
}

export function createDailyRequestCache<T>(
  request: () => Promise<T>,
  getDateKey: () => string = getKstDateKey,
) {
  let entry: DailyRequestCacheEntry<T> | null = null;

  const get = () => {
    const dateKey = getDateKey();

    if (entry?.dateKey === dateKey) {
      if (entry.hasData) {
        return Promise.resolve(entry.data as T);
      }

      if (entry.pending) {
        return entry.pending;
      }
    }

    const nextEntry: DailyRequestCacheEntry<T> = {
      dateKey,
      hasData: false,
    };

    const pending = request()
      .then((data) => {
        if (entry === nextEntry) {
          nextEntry.data = data;
          nextEntry.hasData = true;
          nextEntry.pending = undefined;
        }

        return data;
      })
      .catch((error: unknown) => {
        if (entry === nextEntry) {
          entry = null;
        }

        throw error;
      });

    nextEntry.pending = pending;
    entry = nextEntry;

    return pending;
  };

  const invalidate = () => {
    entry = null;
  };

  return {
    get,
    invalidate,
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

function getRecommendationCacheKey() {
  const userId = useAuthStore.getState().user?.userId ??
    "anonymous";

  return `${userId}:${getKstDateKey()}`;
}

const todayRecommendationCache = createDailyRequestCache(
  requestTodayRecommendation,
  getRecommendationCacheKey,
);

const recommendationModesCache = createDailyRequestCache(
  requestRecommendationModes,
  getRecommendationCacheKey,
);

export async function getTodayRecommendation():
Promise<TodayRecommendationResponse> {
  return todayRecommendationCache.get();
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
  return recommendationModesCache.get();
}

export function invalidateDailyRecommendationCache() {
  todayRecommendationCache.invalidate();
  recommendationModesCache.invalidate();
}

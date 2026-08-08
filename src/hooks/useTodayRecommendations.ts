import {
  useEffect,
  useState,
} from "react";

import { getTodayRecommendation } from "@/api/recommendations";

import type { RecommendedTaskItem } from "@/types/recommendationApi";

export function useTodayRecommendations(
  refreshKey: number,
) {
  const [
    recommendedTasks,
    setRecommendedTasks,
  ] = useState<RecommendedTaskItem[]>([]);

  const [
    loadingRecommendations,
    setLoadingRecommendations,
  ] = useState(true);

  const [
    recommendationError,
    setRecommendationError,
  ] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTodayRecommendation() {
      try {
        setLoadingRecommendations(true);
        setRecommendationError(null);

        const response =
          await getTodayRecommendation();

        if (cancelled) {
          return;
        }

        const topTasks = [
          ...response.topTasks,
        ]
          .sort(
            (first, second) =>
              first.rankOrder -
              second.rankOrder,
          )
          .slice(0, 3);

        setRecommendedTasks(topTasks);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setRecommendedTasks([]);
        setRecommendationError(
          "오늘 추천 과업을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setLoadingRecommendations(
            false,
          );
        }
      }
    }

    void loadTodayRecommendation();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return {
    recommendedTasks,
    loadingRecommendations,
    recommendationError,
  };
}
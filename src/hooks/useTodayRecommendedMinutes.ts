import { useEffect, useState } from "react";

import { getTodayRecommendation } from "@/api/recommendations";

export function useTodayRecommendedMinutes(refreshKey = 0) {
  const [recommendedMinutes, setRecommendedMinutes] =
    useState<number | null>(null);
  const [
    isLoadingRecommendedMinutes,
    setIsLoadingRecommendedMinutes,
  ] = useState(true);
  const [recommendationTimeError, setRecommendationTimeError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRecommendedMinutes = async () => {
      try {
        setRecommendationTimeError(null);

        const response =
          await getTodayRecommendation();

        if (cancelled) {
          return;
        }

        setRecommendedMinutes(
          Number.isFinite(response.totalRecommendedMinutes)
            ? Math.max(
                0,
                response.totalRecommendedMinutes,
              )
            : 0,
        );
      } catch {
        if (cancelled) {
          return;
        }

        setRecommendedMinutes(null);
        setRecommendationTimeError(
          "오늘 권장 시간을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingRecommendedMinutes(false);
        }
      }
    };

    void loadRecommendedMinutes();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return {
    recommendedMinutes,
    isLoadingRecommendedMinutes,
    recommendationTimeError,
  };
}

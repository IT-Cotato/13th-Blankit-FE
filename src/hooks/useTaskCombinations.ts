import { useEffect, useState } from "react";

import { getRecommendationModes } from "@/api/recommendations";
import { mapRecommendationModes } from "@/utils/taskCombinationMapper";

import type { TaskCombination } from "@/types/taskCombination";

export function useTaskCombinations(refreshKey = 0) {
  const [combinations, setCombinations] = useState<
    TaskCombination[]
  >([]);
  const [loadingCombinations, setLoadingCombinations] =
    useState(true);
  const [combinationError, setCombinationError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    const loadTaskCombinations = async () => {
      setLoadingCombinations(true);
      setCombinationError(null);

      try {
        const response = await getRecommendationModes();

        if (cancelled) {
          return;
        }

        setCombinations(mapRecommendationModes(response));
      } catch {
        if (cancelled) {
          return;
        }

        setCombinations([]);
        setCombinationError(
          "과업 조합 추천을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setLoadingCombinations(false);
        }
      }
    };

    void loadTaskCombinations();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return {
    combinations,
    loadingCombinations,
    combinationError,
  };
}

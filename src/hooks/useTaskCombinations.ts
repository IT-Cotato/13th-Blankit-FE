import { useEffect, useState } from "react";

import { getRecommendationModes } from "@/api/recommendations";
import { mapRecommendationModesWithVisibility } from "@/utils/taskCombinationMapper";

import type {
  CombinationModeId,
  TaskCombination,
} from "@/types/taskCombination";

export function useTaskCombinations(refreshKey = 0) {
  const [combinations, setCombinations] = useState<
    TaskCombination[]
  >([]);
  const [loadingCombinations, setLoadingCombinations] =
    useState(true);
  const [combinationError, setCombinationError] = useState<
    string | null
  >(null);
  const [hiddenDuplicateModeIds, setHiddenDuplicateModeIds] =
    useState<CombinationModeId[]>([]);

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

        const mappedModes =
          mapRecommendationModesWithVisibility(response);

        setCombinations(mappedModes.combinations);
        setHiddenDuplicateModeIds(
          mappedModes.hiddenDuplicateModeIds,
        );
      } catch {
        if (cancelled) {
          return;
        }

        setCombinations([]);
        setHiddenDuplicateModeIds([]);
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
    hiddenDuplicateModeIds,
  };
}

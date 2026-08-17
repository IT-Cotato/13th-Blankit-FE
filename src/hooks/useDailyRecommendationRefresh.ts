import { useEffect, useState } from "react";

import {
  getRecommendationModes,
  getTodayRecommendation,
  invalidateDailyRecommendationCache,
} from "@/api/recommendations";
import {
  getKstDateKey,
  getMillisecondsUntilNextKstMidnight,
} from "@/utils/kstDate";

const MIDNIGHT_TIMER_BUFFER_MILLISECONDS = 50;

function refreshDailyRecommendations() {
  void Promise.allSettled([
    getTodayRecommendation(),
    getRecommendationModes(),
  ]);
}

export function useDailyRecommendationRefresh(
  enabled: boolean,
) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let lastDateKey = getKstDateKey();
    let timeoutId: number | null = null;

    const scheduleNextMidnight = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        checkDateChange();
        scheduleNextMidnight();
      }, getMillisecondsUntilNextKstMidnight() +
        MIDNIGHT_TIMER_BUFFER_MILLISECONDS);
    };

    const checkDateChange = () => {
      const currentDateKey = getKstDateKey();

      if (currentDateKey === lastDateKey) {
        return;
      }

      lastDateKey = currentDateKey;
      invalidateDailyRecommendationCache();
      refreshDailyRecommendations();
      setRefreshKey((current) => current + 1);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      checkDateChange();
      scheduleNextMidnight();
    };

    refreshDailyRecommendations();
    scheduleNextMidnight();
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );
    window.addEventListener("focus", checkDateChange);

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      window.removeEventListener("focus", checkDateChange);
    };
  }, [enabled]);

  return refreshKey;
}

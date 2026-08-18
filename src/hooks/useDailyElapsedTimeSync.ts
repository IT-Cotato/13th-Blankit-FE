import { useEffect } from "react";

import { fetchDailyFeedback } from "@/api/calendar/stats";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import {
  getKstDateKey,
  getMillisecondsUntilNextKstMidnight,
} from "@/utils/kstDate";

const MIDNIGHT_TIMER_BUFFER_MILLISECONDS = 50;

export function useDailyElapsedTimeSync(enabled: boolean) {
  const syncDailyElapsedSeconds = usePlaylistStore(
    (state) => state.syncDailyElapsedSeconds,
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    let currentDateKey = getKstDateKey();
    let pendingDateKey: string | null = null;
    let timeoutId: number | null = null;

    const loadDailyElapsedTime = async () => {
      const requestedDateKey = currentDateKey;

      if (pendingDateKey === requestedDateKey) {
        return;
      }

      pendingDateKey = requestedDateKey;

      try {
        const dailyStats = await fetchDailyFeedback(
          requestedDateKey,
        );

        if (
          active &&
          currentDateKey === requestedDateKey
        ) {
          syncDailyElapsedSeconds(
            dailyStats.totalElapsedSeconds,
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (pendingDateKey === requestedDateKey) {
          pendingDateKey = null;
        }
      }
    };

    const checkDateChange = () => {
      const nextDateKey = getKstDateKey();

      if (nextDateKey === currentDateKey) {
        return;
      }

      currentDateKey = nextDateKey;
      syncDailyElapsedSeconds(0, true);
      void loadDailyElapsedTime();
    };

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

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      checkDateChange();
      void loadDailyElapsedTime();
      scheduleNextMidnight();
    };

    void loadDailyElapsedTime();
    scheduleNextMidnight();
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      active = false;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [enabled, syncDailyElapsedSeconds]);
}

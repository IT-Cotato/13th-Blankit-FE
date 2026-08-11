import { useEffect, useState } from "react";

import { usePlaylistStore } from "@/store/usePlaylistStore";
import {
  getElapsedSeconds,
  getPlaylistElapsedSeconds,
  getTaskProgress,
} from "@/utils/taskTimer";

export function useCurrentTaskTimer(
  estimatedMinutes: number,
) {
  const elapsedSeconds = usePlaylistStore(
    (state) => state.elapsedSeconds,
  );
  const accumulatedElapsedSeconds = usePlaylistStore(
    (state) => state.accumulatedElapsedSeconds,
  );
  const startedAt = usePlaylistStore(
    (state) => state.startedAt,
  );
  const isPlaying = usePlaylistStore(
    (state) => state.isPlaying,
  );
  const playCurrentTask = usePlaylistStore(
    (state) => state.playCurrentTask,
  );
  const pauseCurrentTask = usePlaylistStore(
    (state) => state.pauseCurrentTask,
  );
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isPlaying]);

  const displayedElapsedSeconds = getElapsedSeconds(
    elapsedSeconds,
    startedAt,
    isPlaying,
    now,
  );
  const displayedPlaylistElapsedSeconds =
    getPlaylistElapsedSeconds(
      accumulatedElapsedSeconds,
      displayedElapsedSeconds,
    );

  const toggleTimer = () => {
    const actionNow = Date.now();

    if (isPlaying) {
      pauseCurrentTask(actionNow);
    } else {
      playCurrentTask(actionNow);
    }

    setNow(actionNow);
  };

  return {
    displayedElapsedSeconds,
    displayedPlaylistElapsedSeconds,
    progress: getTaskProgress(
      displayedElapsedSeconds,
      estimatedMinutes,
    ),
    isPlaying,
    pauseCurrentTask,
    toggleTimer,
  };
}

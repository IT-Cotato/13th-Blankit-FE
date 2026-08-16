import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { useTaskSession } from "@/hooks/useTaskSession";
import { useTodayRecommendedMinutes } from "@/hooks/useTodayRecommendedMinutes";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import {
  getMissingTaskIdMessage,
  shouldRestoreTimerFromSession,
  updateTimerWithSession,
} from "@/utils/taskSessionTimer";
import {
  formatTimer,
  getTaskProgress,
} from "@/utils/taskTimer";

import type { PlaylistTask } from "@/types/taskCombination";

import { TaskTimerToggleIcon } from "./TaskTimerToggleIcon";

interface CurrentTaskMiniPlayerProps {
  task: PlaylistTask;
  onShowToast: (message: string) => void;
}

export function CurrentTaskMiniPlayer({
  task,
  onShowToast,
}: CurrentTaskMiniPlayerProps) {
  const navigate = useNavigate();
  const hasStarted = usePlaylistStore(
    (state) => state.hasStarted,
  );
  const restoreTimerFromSession = usePlaylistStore(
    (state) => state.restoreTimerFromSession,
  );
  const {
    displayedElapsedSeconds,
    displayedPlaylistElapsedSeconds,
    isPlaying,
    toggleTimer,
  } = useCurrentTaskTimer(
    task.estimatedMinutes,
  );
  const {
    recommendedMinutes,
    recommendationTimeError,
  } = useTodayRecommendedMinutes();
  const {
    session,
    isLoadingSession,
    isUpdatingSession,
    changeSessionStatus,
  } = useTaskSession(task.taskId ?? null);
  const missingTaskIdMessage =
    getMissingTaskIdMessage(task.taskId);
  const progress = getTaskProgress(
    displayedPlaylistElapsedSeconds,
    recommendedMinutes ?? 0,
  );

  useEffect(() => {
    if (!missingTaskIdMessage) {
      return;
    }

    onShowToast(missingTaskIdMessage);
  }, [missingTaskIdMessage, onShowToast]);

  useEffect(() => {
    if (!recommendationTimeError) {
      return;
    }

    onShowToast(recommendationTimeError);
  }, [onShowToast, recommendationTimeError]);

  useEffect(() => {
    if (
      !session ||
      !shouldRestoreTimerFromSession(hasStarted)
    ) {
      return;
    }

    restoreTimerFromSession(
      session.elapsedTime,
      session.status === "PLAYING",
    );
  }, [hasStarted, restoreTimerFromSession, session]);

  const handleOpenPlayer = () => {
    navigate("/task-playlist");
  };

  const handleToggleTimer = async () => {
    if (
      !session ||
      isLoadingSession ||
      isUpdatingSession
    ) {
      return;
    }

    try {
      await updateTimerWithSession(
        isPlaying ? "PAUSED" : "PLAYING",
        displayedElapsedSeconds,
        changeSessionStatus,
        toggleTimer,
      );
    } catch {
      return;
    }
  };

  return (
    <section
      aria-label="현재 과업"
      className="fixed bottom-[90px] left-0 right-0 z-40 h-[80px] border-t border-black-800 bg-black-850"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-1 bg-black-750"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 transition-[width] duration-300"
        style={{ width: `${progress}%` }}
      >
        <span
          className="block h-1 bg-green-500"
        />
        <span
          className="absolute bottom-0 left-0 right-0 top-1"
          style={{
            background:
              "linear-gradient(180deg, rgba(50, 222, 86, 0.2) 0%, rgba(50, 222, 86, 0) 37.79%)",
          }}
        />
      </span>

      <div className="flex h-full items-center px-7 pt-1">
        <button
          type="button"
          onClick={handleOpenPlayer}
          className="flex min-w-0 flex-1 items-center gap-4 text-left"
          aria-label={`${task.title} 플레이 화면으로 이동`}
        >
          {task.categoryIcon ? (
            <CategoryIconBadge
              icon={task.categoryIcon}
              color={task.category.color}
              size={40}
            />
          ) : (
            <span
              aria-hidden="true"
              className="h-12 w-12 shrink-0 rounded-[4px] bg-black-300"
            />
          )}

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-black-300">
              {formatTimer(displayedPlaylistElapsedSeconds)}
            </span>
            <span className="mt-1 block truncate text-[12px] font-medium text-black-600">
              {task.title}
            </span>
          </span>
        </button>

        <button
          type="button"
          disabled={
            !session ||
            isLoadingSession ||
            isUpdatingSession
          }
          onClick={() => {
            void handleToggleTimer();
          }}
          aria-label={isPlaying ? "과업 일시정지" : "과업 재생"}
          className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center"
        >
          <TaskTimerToggleIcon isPlaying={isPlaying} />
        </button>
      </div>
    </section>
  );
}

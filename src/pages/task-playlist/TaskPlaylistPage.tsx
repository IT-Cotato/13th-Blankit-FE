import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import checkButtonGreenIcon from "@/assets/icons/task-combination/check-button-green.svg";
import pauseButtonCircleIcon from "@/assets/icons/task-combination/pause-button-circle.svg";
import playButtonCircleIcon from "@/assets/icons/task-combination/play-button-circle.svg";
import vShapeButtonIcon from "@/assets/icons/task-combination/v-shape-button.svg";
import xButtonRedIcon from "@/assets/icons/task-combination/x-button-red.svg";
import { Toast } from "@/components/common/Toast";
import { TaskFeedbackSheet } from "@/components/task-feedback/TaskFeedbackSheet";
import { EmptyPlaylistPlayer } from "@/components/task-playlist/EmptyPlaylistPlayer";
import { PlaylistBottomSheet } from "@/components/task-playlist/PlaylistBottomSheet";
import { RecommendedTimeGuide } from "@/components/task-playlist/RecommendedTimeGuide";
import { TaskCompletionTooltip } from "@/components/task-playlist/TaskCompletionTooltip";
import { TaskMosaicProgress } from "@/components/task-playlist/TaskMosaicProgress";
import { TaskPlayerHeader } from "@/components/task-playlist/TaskPlayerHeader";
import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { useTaskSession } from "@/hooks/useTaskSession";
import { useTodayRecommendedMinutes } from "@/hooks/useTodayRecommendedMinutes";
import { useToast } from "@/hooks/useToast";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useTaskCompletionStore } from "@/store/useTaskCompletionStore";
import {
  getMissingTaskIdMessage,
  shouldRestoreTimerFromSession,
  updateTimerWithSession,
} from "@/utils/taskSessionTimer";
import { formatTimer } from "@/utils/taskTimer";
import { getTaskPlayerControls } from "@/utils/taskPlayerControls";

import type { TaskFeedbackResponse } from "@/types/taskFeedbackApi";

export function TaskPlaylistPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const task = usePlaylistStore(
    (state) => state.playlist[0],
  );

  const hasStarted = usePlaylistStore(
    (state) => state.hasStarted,
  );

  const hasSeenCompletionTooltip = usePlaylistStore(
    (state) => state.hasSeenCompletionTooltip,
  );

  const completeFeedback = usePlaylistStore(
    (state) => state.completeFeedback,
  );

  const dismissCompletionTooltip = usePlaylistStore(
    (state) => state.dismissCompletionTooltip,
  );

  const restoreTimerFromSession = usePlaylistStore(
    (state) => state.restoreTimerFromSession,
  );

  const pauseCurrentTask = usePlaylistStore(
    (state) => state.pauseCurrentTask,
  );

  const markTaskCompleted = useTaskCompletionStore(
    (state) => state.markTaskCompleted,
  );

  const [isBottomSheetOpen, setIsBottomSheetOpen] =
    useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] =
    useState(false);

  const {
    message: feedbackToastMessage,
    showToast: showFeedbackToast,
  } = useToast();

  const {
    message: playlistCreatedToastMessage,
    showToast: showPlaylistCreatedToast,
  } = useToast();

  const queuedPlaylistCreatedToastMessage = (
    location.state as {
      playlistCreatedToastMessage?: string;
    } | null
  )?.playlistCreatedToastMessage;

  const {
    session,
    isLoadingSession,
    isUpdatingSession,
    sessionError,
    changeSessionStatus,
    retrySession,
  } = useTaskSession(task?.taskId ?? null);

  const {
    displayedElapsedSeconds: currentTaskElapsedSeconds,
    displayedPlaylistElapsedSeconds,
    isPlaying,
    toggleTimer,
  } = useCurrentTaskTimer(task?.estimatedMinutes ?? 0);

  const {
    recommendedMinutes,
    isLoadingRecommendedMinutes,
    recommendationTimeError,
  } = useTodayRecommendedMinutes();

  const hasPlaylistStarted =
    hasStarted || displayedPlaylistElapsedSeconds > 0;
  const missingTaskIdMessage = task
    ? getMissingTaskIdMessage(task.taskId)
    : null;

  const controls = getTaskPlayerControls({
    isPlaying,
    hasStarted,
  });

  const shouldShowCompletionTooltip =
    !hasSeenCompletionTooltip &&
    controls.taskAction === "complete" &&
    !queuedPlaylistCreatedToastMessage &&
    !playlistCreatedToastMessage;

  useEffect(() => {
    if (!queuedPlaylistCreatedToastMessage) {
      return;
    }

    showPlaylistCreatedToast(
      queuedPlaylistCreatedToastMessage,
    );
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [
    location.pathname,
    navigate,
    queuedPlaylistCreatedToastMessage,
    showPlaylistCreatedToast,
  ]);

  useEffect(() => {
    if (!missingTaskIdMessage) {
      return;
    }

    showFeedbackToast(missingTaskIdMessage);
  }, [missingTaskIdMessage, showFeedbackToast]);

  useEffect(() => {
    if (!sessionError) {
      return;
    }

    showFeedbackToast(sessionError);
  }, [sessionError, showFeedbackToast]);

  useEffect(() => {
    if (!recommendationTimeError) {
      return;
    }

    showFeedbackToast(recommendationTimeError);
  }, [recommendationTimeError, showFeedbackToast]);

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

  const handleToggleTimer = async () => {
    if (
      !session ||
      isLoadingSession ||
      isUpdatingSession
    ) {
      return;
    }

    const nextStatus = isPlaying
      ? "PAUSED"
      : "PLAYING";

    try {
      await updateTimerWithSession(
        nextStatus,
        currentTaskElapsedSeconds,
        changeSessionStatus,
        toggleTimer,
      );
    } catch {
      return;
    }
  };

  if (!task) {
    return <EmptyPlaylistPlayer />;
  }

  const handleOpenFeedback = async () => {
    if (
      !session ||
      isLoadingSession ||
      isUpdatingSession
    ) {
      return;
    }

    if (
      session.status === "PAUSED" &&
      !isPlaying
    ) {
      setIsFeedbackOpen(true);
      return;
    }

    try {
      const updatedSession =
        await changeSessionStatus(
          "PAUSED",
          currentTaskElapsedSeconds,
        );

      if (!updatedSession) {
        return;
      }

      pauseCurrentTask(Date.now());

      setIsFeedbackOpen(true);
    } catch {
      return;
    }
  };

  const handleCompleteFeedback = async (
    feedback: TaskFeedbackResponse,
  ) => {
    const result = completeFeedback(task.id);

    if (!result) {
      return false;
    }

    if (feedback.isCompleted) {
      markTaskCompleted(feedback.taskId);
    }

    setIsFeedbackOpen(false);
    showFeedbackToast(
      "피드백을 완료했습니다.",
    );

    if (result === "stayed") {
      retrySession();
    }

    return true;
  };

  return (
    <div className="min-h-[calc(100dvh-90px)] px-5 pb-[100px]">
      <header className="flex h-[50px] items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="플레이 화면 닫기"
          className="flex h-10 w-10 items-center justify-start"
        >
          <img
            src={vShapeButtonIcon}
            alt=""
            className="h-[8px] w-[13px]"
          />
        </button>
      </header>

      <TaskPlayerHeader task={task} />

      <div className="flex flex-col items-center pt-20">
        <TaskMosaicProgress
          elapsedSeconds={displayedPlaylistElapsedSeconds}
          recommendedMinutes={recommendedMinutes}
          isLoadingRecommendedMinutes={
            isLoadingRecommendedMinutes
          }
        />

        <div className="grid w-full max-w-[280px] grid-cols-[52px_1fr_52px] items-center gap-4 pt-20">
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
            aria-label={
              isPlaying
                ? "과업 일시정지"
                : "과업 재생"
            }
            className="flex h-12 w-12 items-center justify-center rounded-full active:scale-95"
          >
            <img
              src={
                controls.timerControl === "pause"
                  ? pauseButtonCircleIcon
                  : playButtonCircleIcon
              }
              alt=""
              className="h-12 w-12"
            />
          </button>

          <div className="relative flex items-center justify-center">
            {hasSeenCompletionTooltip && (
              <RecommendedTimeGuide />
            )}

            <p className="whitespace-nowrap text-center text-[32px] font-bold text-black-100">
              {hasPlaylistStarted
                ? formatTimer(
                    displayedPlaylistElapsedSeconds,
                  )
                : formatTimer(
                    (recommendedMinutes ?? 0) * 60,
                  )}
            </p>
          </div>

          <div className="relative ml-auto h-12 w-12">
            <button
              type="button"
              disabled={
                controls.taskAction === "complete" &&
                (!session ||
                  isLoadingSession ||
                  isUpdatingSession)
              }
              onClick={
                controls.taskAction === "complete"
                  ? () => {
                      void handleOpenFeedback();
                    }
                  : () => navigate(-1)
              }
              aria-label={
                controls.taskAction === "complete"
                  ? `${task.title} 완료`
                  : "플레이리스트 화면 나가기"
              }
              className="flex h-12 w-12 items-center justify-center rounded-full active:scale-95"
            >
              <img
                src={
                  controls.taskAction === "complete"
                    ? checkButtonGreenIcon
                    : xButtonRedIcon
                }
                alt=""
                className="h-12 w-12"
              />
            </button>

            {shouldShowCompletionTooltip && (
              <TaskCompletionTooltip
                onDismiss={dismissCompletionTooltip}
              />
            )}
          </div>
        </div>
      </div>

      <PlaylistBottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
        onShowToast={showFeedbackToast}
      />

      <TaskFeedbackSheet
        open={isFeedbackOpen}
        taskId={task.id}
        apiTaskId={task.taskId ?? null}
        sessionId={session?.taskSessionId ?? null}
        onClose={() => setIsFeedbackOpen(false)}
        onComplete={handleCompleteFeedback}
        onShowToast={showFeedbackToast}
      />

      <Toast
        message={feedbackToastMessage}
        variant="taskCombination"
      />

      <Toast
        message={playlistCreatedToastMessage}
        variant="taskCombination"
        centeredWithBackdrop
      />
    </div>
  );
}

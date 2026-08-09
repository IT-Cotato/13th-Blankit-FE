import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { useToast } from "@/hooks/useToast";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { formatTimer } from "@/utils/taskTimer";
import { getTaskPlayerControls } from "@/utils/taskPlayerControls";

export function TaskPlaylistPage() {
  const navigate = useNavigate();

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

  const [isBottomSheetOpen, setIsBottomSheetOpen] =
    useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] =
    useState(false);

  const feedbackToast = useToast();

  const {
    displayedElapsedSeconds,
    isPlaying,
    pauseCurrentTask,
    toggleTimer,
  } = useCurrentTaskTimer(task?.estimatedMinutes ?? 0);

  const controls = getTaskPlayerControls({
    isPlaying,
    hasStarted,
  });

  useEffect(() => {
    pauseCurrentTask(Date.now());
  }, [pauseCurrentTask]);

  if (!task) {
    return <EmptyPlaylistPlayer />;
  }

  const handleOpenFeedback = () => {
    pauseCurrentTask(Date.now());
    setIsFeedbackOpen(true);
  };

  const handleCompleteFeedback = () => {
    const result = completeFeedback(task.id);

    if (!result) {
      return;
    }

    setIsFeedbackOpen(false);
    feedbackToast.showToast("피드백을 완료했어요.");
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
          elapsedSeconds={displayedElapsedSeconds}
          estimatedMinutes={task.estimatedMinutes}
        />

        <div className="grid w-full max-w-[280px] grid-cols-[52px_1fr_52px] items-center gap-4 pt-20">
          <button
            type="button"
            onClick={toggleTimer}
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
              {hasStarted
                ? formatTimer(displayedElapsedSeconds)
                : formatTimer(
                    task.estimatedMinutes * 60,
                  )}
            </p>
          </div>

          <div className="relative ml-auto h-12 w-12">
            <button
              type="button"
              onClick={
                controls.taskAction === "complete"
                  ? handleOpenFeedback
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

            {!hasSeenCompletionTooltip &&
              controls.taskAction === "complete" && (
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
        onShowToast={feedbackToast.showToast}
      />

      <TaskFeedbackSheet
        open={isFeedbackOpen}
        taskId={task.id}
        onClose={() => setIsFeedbackOpen(false)}
        onComplete={handleCompleteFeedback}
      />

      <Toast
        message={feedbackToast.message}
        variant="taskCombination"
      />
    </div>
  );
}

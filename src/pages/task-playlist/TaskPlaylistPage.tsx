import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import checkButtonGreenIcon from "@/assets/icons/task-combination/check-button-green.svg";
import iButtonIcon from "@/assets/icons/task-combination/i-button.svg";
import pauseButtonCircleIcon from "@/assets/icons/task-combination/pause-button-circle.svg";
import playButtonCircleIcon from "@/assets/icons/task-combination/play-button-circle.svg";
import vShapeButtonIcon from "@/assets/icons/task-combination/v-shape-button.svg";
import xButtonRedIcon from "@/assets/icons/task-combination/x-button-red.svg";
import { TaskFeedbackSheet } from "@/components/task-feedback/TaskFeedbackSheet";
import { AnchoredTooltip } from "@/components/task-playlist/AnchoredTooltip";
import { PlaylistBottomSheet } from "@/components/task-playlist/PlaylistBottomSheet";
import { TaskCompletionTooltip } from "@/components/task-playlist/TaskCompletionTooltip";
import { TaskMosaicProgress } from "@/components/task-playlist/TaskMosaicProgress";
import { TaskPlayerHeader } from "@/components/task-playlist/TaskPlayerHeader";
import { Toast } from "@/components/task-combination/Toast";
import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { formatTimer } from "@/utils/taskTimer";
import { getTaskPlayerControls } from "@/utils/taskPlayerControls";

function EmptyPlaylistPlayer() {
  const navigate = useNavigate();
  const dragStartYRef = useRef<number | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] =
    useState(false);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    dragStartYRef.current = event.clientY;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartYRef.current === null) {
      return;
    }

    const distance =
      event.clientY - dragStartYRef.current;
    dragStartYRef.current = null;

    if (!isBottomSheetOpen && distance > 60) {
      navigate(-1);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="flex min-h-[calc(100dvh-90px)] touch-pan-y flex-col px-5"
    >
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
            className="h-[7px] w-3"
          />
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center pb-[100px] text-center">
        <div>
          <h1 className="text-[18px] font-semibold text-black-200">
            재생할 과업이 없어요
          </h1>
          <p className="mt-3 text-[13px] font-medium leading-[150%] text-black-600">
            화면을 아래로 내리면
            <br />
            이전 화면으로 돌아갑니다.
          </p>
        </div>
      </div>

      <PlaylistBottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
      />
    </div>
  );
}

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
  const [showFeedbackToast, setShowFeedbackToast] =
    useState(false);
  const [
    isRecommendedTimeTooltipOpen,
    setIsRecommendedTimeTooltipOpen,
  ] = useState(false);
  const feedbackToastTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
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

  useEffect(
    () => () => {
      if (feedbackToastTimerRef.current) {
        clearTimeout(feedbackToastTimerRef.current);
      }
    },
    [],
  );

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
    setShowFeedbackToast(true);

    if (feedbackToastTimerRef.current) {
      clearTimeout(feedbackToastTimerRef.current);
    }

    feedbackToastTimerRef.current = setTimeout(() => {
      setShowFeedbackToast(false);
      feedbackToastTimerRef.current = null;
    }, 2500);
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

        <div className="pt-20 gap-4 grid w-full max-w-[280px] grid-cols-[52px_1fr_52px] items-center">
          <button
            type="button"
            onClick={toggleTimer}
            aria-label={
              isPlaying ? "과업 일시정지" : "과업 재생"
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
              <div className="absolute bottom-[calc(100%+2px)] left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap">
                <span className="text-[14px] font-medium text-black-600">
                  권장시간
                </span>

                <div className="relative h-[14px] w-[14px]">
                  <button
                    type="button"
                    onClick={() =>
                      setIsRecommendedTimeTooltipOpen(
                        (open) => !open,
                      )
                    }
                    aria-label="권장시간 계산 안내"
                    aria-expanded={
                      isRecommendedTimeTooltipOpen
                    }
                    className="flex h-[14px] w-[14px] items-center justify-center"
                  >
                    <img
                      src={iButtonIcon}
                      alt=""
                      className="h-[14px] w-[14px]"
                    />
                  </button>

                  {isRecommendedTimeTooltipOpen && (
                    <AnchoredTooltip
                      variant="recommendedTime"
                      onDismiss={() =>
                        setIsRecommendedTimeTooltipOpen(
                          false,
                        )
                      }
                      dialogLabel="권장시간 계산 안내"
                      closeLabel="권장시간 안내 닫기"
                    >
                      과업의 예상 시간과 마감일을 반영해
                      <br />
                      오늘의 권장 시간을 계산했어요.
                    </AnchoredTooltip>
                  )}
                </div>
              </div>
            )}

            <p className="whitespace-nowrap text-center text-[32px] font-bold text-black-100">
              {hasStarted
                ? formatTimer(displayedElapsedSeconds)
                : formatTimer(task.estimatedMinutes * 60)}
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
      />

      <TaskFeedbackSheet
        open={isFeedbackOpen}
        taskId={task.id}
        onClose={() => setIsFeedbackOpen(false)}
        onComplete={handleCompleteFeedback}
      />

      {showFeedbackToast && (
        <Toast message="피드백을 완료했어요." />
      )}

    </div>
  );
}

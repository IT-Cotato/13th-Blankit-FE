import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import vShapeButtonIcon from "@/assets/icons/task-combination/v-shape-button.svg";
import { PlaylistBottomSheet } from "@/components/task-playlist/PlaylistBottomSheet";
import { TaskCompletionTooltip } from "@/components/task-playlist/TaskCompletionTooltip";
import { TaskMosaicProgress } from "@/components/task-playlist/TaskMosaicProgress";
import { TaskPlayerHeader } from "@/components/task-playlist/TaskPlayerHeader";
import { TaskTimerToggleIcon } from "@/components/task-combination/TaskTimerToggleIcon";
import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { formatTimer } from "@/utils/taskTimer";

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
      <header className="flex h-[60px] items-center">
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
  const completeCurrentTask = usePlaylistStore(
    (state) => state.completeCurrentTask,
  );
  const dismissCompletionTooltip = usePlaylistStore(
    (state) => state.dismissCompletionTooltip,
  );
  const [isBottomSheetOpen, setIsBottomSheetOpen] =
    useState(false);
  const {
    displayedElapsedSeconds,
    isPlaying,
    pauseCurrentTask,
    toggleTimer,
  } = useCurrentTaskTimer(task?.estimatedMinutes ?? 0);

  useEffect(() => {
    pauseCurrentTask(Date.now());
  }, [pauseCurrentTask]);

  if (!task) {
    return <EmptyPlaylistPlayer />;
  }

  return (
    <div className="min-h-[calc(100dvh-90px)] px-5 pb-[100px]">
      <header className="flex h-[60px] items-center">
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

      <TaskPlayerHeader task={task} />

      <div className="flex flex-col items-center pt-10">
        <TaskMosaicProgress
          elapsedSeconds={displayedElapsedSeconds}
          estimatedMinutes={task.estimatedMinutes}
        />

        <div className="mt-8 grid w-full max-w-[280px] grid-cols-[52px_1fr_52px] items-center">
          <button
            type="button"
            onClick={toggleTimer}
            aria-label={
              isPlaying ? "과업 일시정지" : "과업 재생"
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black-800"
          >
            <TaskTimerToggleIcon isPlaying={isPlaying} />
          </button>

          <p className="text-center text-[24px] font-bold text-black-300">
            {hasStarted
              ? formatTimer(displayedElapsedSeconds)
              : `권장 시간 ${task.estimatedMinutes}분`}
          </p>

          <button
            type="button"
            onClick={completeCurrentTask}
            aria-label={`${task.title} 완료`}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-[20px] font-bold text-black-900 active:scale-95"
          >
            ✓
          </button>
        </div>
      </div>

      <PlaylistBottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
      />

      {!hasSeenCompletionTooltip && (
        <TaskCompletionTooltip
          onDismiss={dismissCompletionTooltip}
        />
      )}
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backIcon from "@/assets/icons/header/back.svg";
import { TaskTimerToggleIcon } from "@/components/task-combination/TaskTimerToggleIcon";
import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { getTaskCombination } from "@/mocks/taskCombinations";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { getCombinationAccentClassName } from "@/utils/taskCombinationCategories";
import { formatTimer } from "@/utils/taskTimer";

export function TaskPlaylistPage() {
  const navigate = useNavigate();
  const task = usePlaylistStore(
    (state) => state.playlist[0],
  );
  const {
    displayedElapsedSeconds,
    progress,
    isPlaying,
    pauseCurrentTask,
    toggleTimer,
  } = useCurrentTaskTimer(task?.estimatedMinutes ?? 0);

  useEffect(() => {
    pauseCurrentTask(Date.now());
  }, [pauseCurrentTask]);

  if (!task) {
    return (
      <div className="flex min-h-[calc(100dvh-90px)] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[20px] font-bold text-black-100">
          재생할 과업이 없어요
        </h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 rounded-[8px] bg-green-500 px-5 py-3 text-[14px] font-semibold text-black-900"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  const combination = getTaskCombination(
    task.sourceModeId,
  );
  const accentClassName = combination
    ? getCombinationAccentClassName(combination.accent)
    : "";

  return (
    <div className="min-h-[calc(100dvh-90px)] px-5 pb-8">
      <header className="flex h-[60px] items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="flex h-10 w-10 items-center justify-start"
        >
          <img
            src={backIcon}
            alt=""
            className="h-3.5 w-3"
          />
        </button>
      </header>

      <div className="flex flex-col items-center pt-10 text-center">
        {combination && (
          <span
            aria-hidden="true"
            className={`flex h-28 w-28 items-center justify-center rounded-[12px] ${accentClassName}`}
          >
            <img
              src={combination.icon}
              alt=""
              className="h-[88%] w-[88%] object-contain"
            />
          </span>
        )}

        <h1 className="mt-5 text-[22px] font-bold text-black-100">
          {task.title}
        </h1>

        <p className="mt-4 text-[24px] font-semibold text-black-300">
          {formatTimer(displayedElapsedSeconds)} /{" "}
          {formatTimer(task.estimatedMinutes * 60)}
        </p>

        <div
          aria-label={`과업 진행률 ${Math.round(progress)}%`}
          className="mt-6 h-2 w-full overflow-hidden rounded-full bg-black-750"
        >
          <div
            className="h-full rounded-full bg-green-500 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={toggleTimer}
          aria-label={isPlaying ? "과업 일시정지" : "과업 재생"}
          className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-black-800"
        >
          <TaskTimerToggleIcon isPlaying={isPlaying} />
        </button>
      </div>
    </div>
  );
}

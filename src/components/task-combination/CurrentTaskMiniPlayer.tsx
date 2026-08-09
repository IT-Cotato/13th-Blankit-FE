import { useNavigate } from "react-router-dom";

import { useCurrentTaskTimer } from "@/hooks/useCurrentTaskTimer";
import { getTaskCombination } from "@/mocks/taskCombinations";
import { getCombinationAccentClassName } from "@/utils/taskCombinationCategories";
import { formatTimer } from "@/utils/taskTimer";

import type { PlaylistTask } from "@/types/taskCombination";

import { TaskTimerToggleIcon } from "./TaskTimerToggleIcon";

interface CurrentTaskMiniPlayerProps {
  task: PlaylistTask;
}

export function CurrentTaskMiniPlayer({
  task,
}: CurrentTaskMiniPlayerProps) {
  const navigate = useNavigate();
  const combination = getTaskCombination(
    task.sourceMode ?? "",
  );
  const accentClassName = combination
    ? getCombinationAccentClassName(combination.accent)
    : "";
  const {
    displayedElapsedSeconds,
    progress,
    isPlaying,
    pauseCurrentTask,
    toggleTimer,
  } = useCurrentTaskTimer(
    task.estimatedMinutes,
  );

  const handleOpenPlayer = () => {
    pauseCurrentTask(Date.now());
    navigate("/task-playlist");
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
          {combination ? (
            <span
              aria-hidden="true"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] ${accentClassName}`}
            >
              <img
                src={combination.icon}
                alt=""
                className="h-[88%] w-[88%] object-contain"
              />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="h-12 w-12 shrink-0 rounded-[4px] bg-black-300"
            />
          )}

          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-black-300">
              {formatTimer(displayedElapsedSeconds)} /{" "}
              {formatTimer(task.estimatedMinutes * 60)}
            </span>
            <span className="mt-1 block truncate text-[12px] font-medium text-black-600">
              {task.title}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={toggleTimer}
          aria-label={isPlaying ? "과업 일시정지" : "과업 재생"}
          className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center"
        >
          <TaskTimerToggleIcon isPlaying={isPlaying} />
        </button>
      </div>
    </section>
  );
}

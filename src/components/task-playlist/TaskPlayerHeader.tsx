import type { PlaylistTask } from "@/types/taskCombination";

interface TaskPlayerHeaderProps {
  task: PlaylistTask;
}

const PRIORITY_LABELS = {
  HIGH: "상",
  MEDIUM: "중",
  LOW: "하",
} as const;

const PRIORITY_CLASS_NAMES = {
  HIGH: "border-red-400 text-red-400",
  MEDIUM: "border-orange-400 text-orange-400",
  LOW: "border-lime-400 text-lime-400",
} as const;

export function TaskPlayerHeader({
  task,
}: TaskPlayerHeaderProps) {
  return (
    <section
      aria-labelledby="current-task-title"
      className="w-full rounded-[10px] bg-black-850 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black-800">
          <img
            src={task.categoryIcon}
            alt=""
            className="h-5 w-5"
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1
              id="current-task-title"
              className="truncate text-[14px] font-semibold text-black-200"
            >
              {task.title}
            </h1>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_CLASS_NAMES[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>

          {task.lastMemo && (
            <p className="mt-1 truncate text-[11px] font-medium text-black-600">
              {task.lastMemo}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

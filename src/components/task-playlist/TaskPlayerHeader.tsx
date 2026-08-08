import type { PlaylistTask } from "@/types/taskCombination";

interface TaskPlayerHeaderProps {
  task: PlaylistTask;
}

export function TaskPlayerHeader({
  task,
}: TaskPlayerHeaderProps) {
  return (
    <section
      aria-labelledby="current-task-title"
      className="w-full rounded-[12px] bg-black-850 p-3"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black-800">
          <img
            src={task.categoryIcon}
            alt=""
            className="h-5 w-5"
          />
        </span>

        <div className="min-w-0 flex-1">
          <h1
            id="current-task-title"
            className="line-clamp-2 text-[14px] font-medium text-black-100"
          >
            {task.title}
          </h1>

          {task.lastMemo && (
            <p className="mt-1 truncate text-[12px] font-medium text-black-650">
              {task.lastMemo}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

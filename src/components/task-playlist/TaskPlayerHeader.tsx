import { TaskChip } from "@/components/task/TaskChip";

import type { PlaylistTask } from "@/types/taskCombination";

interface TaskPlayerHeaderProps {
  task: PlaylistTask;
}

export function TaskPlayerHeader({
  task,
}: TaskPlayerHeaderProps) {
  return (
    <section aria-labelledby="current-task-title">
      <h1
        id="current-task-title"
        className="sr-only"
      >
        {task.title}
      </h1>

      <TaskChip
        title={task.title}
        memo={task.memo}
        priority={task.priority}
        progressRate={task.progressRate}
        status={task.status}
        category={task.category}
      />
    </section>
  );
}

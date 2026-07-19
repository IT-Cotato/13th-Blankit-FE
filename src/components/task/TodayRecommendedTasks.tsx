import { TaskChip } from "@/components/task/TaskChip";

import type { Task } from "@/types/task";

interface TodayRecommendedTasksProps {
  tasks: Task[];
  onViewAll?: () => void;
  onTaskClick?: (taskId: number) => void;
}

export function TodayRecommendedTasks({
  tasks,
  onViewAll,
  onTaskClick,
}: TodayRecommendedTasksProps) {
  const recommendedTasks = tasks.slice(0, 3);

  if (recommendedTasks.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-black-100">
          오늘 추천 과업
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[18px] font-medium text-black-700"
        >
          전체보기
        </button>
      </div>

      <ul className="flex flex-col gap-5">
        {recommendedTasks.map((task) => (
          <li key={task.taskId}>
            <TaskChip
              title={task.title}
              lastMemo={task.lastMemo}
              progressRate={task.progressRate}
              priority={task.priority}
              status={task.status}
              onClick={() => onTaskClick?.(task.taskId)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
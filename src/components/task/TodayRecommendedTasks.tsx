import { TaskChip } from "@/components/task/TaskChip";

import type { RecommendedTaskItem } from "@/types/recommendationApi";

interface TodayRecommendedTasksProps {
  tasks: RecommendedTaskItem[];
  completedTaskId?: number | null;
  onViewAll?: () => void;
  onTaskClick?: (taskId: number) => void;
}

export function TodayRecommendedTasks({
  tasks,
  completedTaskId = null,
  onViewAll,
  onTaskClick,
}: TodayRecommendedTasksProps) {
  const recommendedTasks = [...tasks]
    .sort(
      (first, second) =>
        first.rankOrder - second.rankOrder,
    )
    .slice(0, 3);

  if (recommendedTasks.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="
        text-[16px] font-semibold
        leading-[150%] tracking-[-0.015em]
        text-black-100
        ">
          오늘 추천 과업
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[14px] font-medium text-black-650"
        >
          전체보기
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {recommendedTasks.map((task) => (
          <li key={task.taskId}>
            <TaskChip
              title={task.title}
              memo={task.memo}
              progressRate={task.progressRate}
              priority={task.priority}
              categoryColor={task.categoryColor}
              categoryIconKey={task.categoryIconKey}
              showCompletionCheck={
                task.taskId === completedTaskId
              }
              onClick={
                task.taskId === completedTaskId
                  ? undefined
                  : () => onTaskClick?.(task.taskId)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { getCategoryPresentation } from "@/constants/category";
import type { TaskHistoryItemResponse } from "@/types/taskApi";

import {
  formatElapsedMinutes,
  formatTaskDeadline,
} from "./similarTaskUtils";

interface SimilarTaskCardProps {
  task: TaskHistoryItemResponse;
  selected: boolean;
  onClick: () => void;
}

export function SimilarTaskCard({
  task,
  selected,
  onClick,
}: SimilarTaskCardProps) {
  const category = getCategoryPresentation({
    categoryId: task.categoryId,
    categoryName: task.categoryName,
    color: task.categoryColor,
    iconKey: task.categoryIconKey,
  });

  return (
    <button
      type="button"
      aria-label={`${task.title} 비슷한 과업으로 선택`}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-3 text-left outline-none transition-colors ${
        selected
          ? "border-transparent bg-black-750"
          : "border-transparent bg-black-800"
      }`}
    >
      <CategoryIconBadge
        icon={category.icon}
        color={category.color}
        size={40}
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-center text-[11px] font-medium leading-[150%] text-black-500">
          {formatTaskDeadline(task.deadline)}
        </span>
        <span className="mt-0.5 block truncate text-[15px] font-semibold leading-[150%] text-black-100">
          {task.title}
        </span>
      </span>

      <span className="shrink-0 text-[12px] font-medium text-black-500">
        {formatElapsedMinutes(
          task.totalElapsedTime,
        )}
      </span>
    </button>
  );
}

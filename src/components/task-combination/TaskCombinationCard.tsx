import type { TaskCombination } from "@/types/taskCombination";
import {
  getCombinationAccentClassName,
  getUniqueTaskCombinationCategories,
} from "@/utils/taskCombinationCategories";

interface TaskCombinationCardProps {
  combination: TaskCombination;
  onClick: () => void;
}

export function TaskCombinationCard({
  combination,
  onClick,
}: TaskCombinationCardProps) {
  const categories = getUniqueTaskCombinationCategories(
    combination.tasks,
  );
  const accentClassName =
    getCombinationAccentClassName(combination.accent);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${combination.name} 상세 보기`}
      className="flex min-w-0 flex-col text-left active:scale-[0.98]"
    >
      <span className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-2 rounded-[16px] bg-black-850 p-3 sm:gap-3 sm:p-5 md:gap-4 md:p-7">
        {categories.map((category) => (
          <span
            key={category.id}
            className="flex aspect-square items-center justify-center rounded-[10px] bg-black-800"
          >
            <img
              src={category.icon}
              alt=""
              className="h-8 w-8"
            />
          </span>
        ))}

        <span
          className={`flex aspect-square items-center justify-center rounded-[10px] ${accentClassName}`}
        >
          <img
            src={combination.icon}
            alt=""
            className="h-[88%] w-[88%] object-contain"
          />
        </span>
      </span>

      <strong className="mt-2 text-[14px] font-semibold leading-[150%] text-black-200">
        {combination.name}
      </strong>

      <span className="text-[11px] font-medium leading-[150%] text-black-600">
        {combination.tasks.length}가지 과업 모음
      </span>
    </button>
  );
}

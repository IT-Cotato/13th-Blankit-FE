import type { TaskCombination } from "@/types/taskCombination";
import {
  getCombinationAccentClassName,
  getTaskCombinationCategoryIcons,
} from "@/utils/taskCombinationCategories";

interface TaskCombinationCardProps {
  combination: TaskCombination;
  onClick: () => void;
}

export function TaskCombinationCard({
  combination,
  onClick,
}: TaskCombinationCardProps) {
  const categoryIcons = getTaskCombinationCategoryIcons(
    combination.tasks,
  );
  const accentClassName =
    getCombinationAccentClassName(combination.accent);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${combination.name} 상세 보기`}
      className="flex w-[calc((100%_-_12px)/2)] min-w-0 flex-col text-left active:scale-[0.98]"
    >
      <span className="flex aspect-square w-full flex-wrap content-start items-start gap-[7.142857%] rounded-[12px] bg-black-850 p-[6.25%]">
        {categoryIcons.map((category) => (
          <span
            key={category.id}
            className="flex aspect-square w-[45.714286%] shrink-0 items-center justify-center rounded-[8px] bg-black-800"
          >
            <span
              aria-hidden="true"
              className="h-8 w-8 bg-black-600 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              style={{
                maskImage: `url("${category.icon}")`,
                WebkitMaskImage: `url("${category.icon}")`,
              }}
            />
          </span>
        ))}

        <span
          className={`flex aspect-square w-[45.714286%] shrink-0 items-center justify-center rounded-[8px] ${accentClassName}`}
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

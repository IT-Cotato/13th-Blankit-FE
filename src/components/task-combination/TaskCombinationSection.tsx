import { useNavigate } from "react-router-dom";

import { useTaskCombinations } from "@/hooks/useTaskCombinations";

import { TaskCombinationCard } from "./TaskCombinationCard";

interface TaskCombinationSectionProps {
  refreshKey: number;
}

export function TaskCombinationSection({
  refreshKey,
}: TaskCombinationSectionProps) {
  const navigate = useNavigate();
  const {
    combinations,
    loadingCombinations,
    combinationError,
  } = useTaskCombinations(refreshKey);

  const visibleCombinations = combinations.filter(
    (combination) => combination.tasks.length > 0,
  );

  if (
    !loadingCombinations &&
    !combinationError &&
    visibleCombinations.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <h2 className="text-[16px] font-semibold leading-[150%] tracking-[-0.015em] text-black-100">
        과업 조합 추천
      </h2>

      {loadingCombinations ? (
        <p className="mt-5 text-[13px] font-medium text-black-600">
          과업 조합을 불러오는 중입니다.
        </p>
      ) : combinationError ? (
        <p className="mt-5 text-[13px] font-medium text-red-400">
          {combinationError}
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap items-start justify-between gap-y-5">
          {visibleCombinations.map((combination) => (
            <TaskCombinationCard
              key={combination.id}
              combination={combination}
              onClick={() =>
                navigate(`/task-combinations/${combination.id}`)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

import { useNavigate } from "react-router-dom";

import { taskCombinations } from "@/mocks/taskCombinations";

import { TaskCombinationCard } from "./TaskCombinationCard";

export function TaskCombinationSection() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-[16px] font-semibold leading-[150%] tracking-[-0.015em] text-black-100">
        과업 조합 추천
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {taskCombinations.map((combination) => (
          <TaskCombinationCard
            key={combination.id}
            combination={combination}
            onClick={() =>
              navigate(
                `/task-combinations/${combination.id}`,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}

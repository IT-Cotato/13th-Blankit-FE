import { useNavigate } from "react-router-dom";

import { formatRecommendedTaskTime } from "@/utils/homeRecommendedTask";

interface DockedTaskTimeBarProps {
  recommendedMinutes: number | null;
}

export function DockedTaskTimeBar({
  recommendedMinutes,
}: DockedTaskTimeBarProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/task-playlist")}
      aria-label="과업 플레이리스트로 이동"
      className="
        fixed bottom-[90px] left-0 right-0 z-40
        flex h-[70px] w-full items-center justify-between
        bg-black-850 px-7 text-left
        active:bg-black-800
      "
    >
      <span className="flex flex-col gap-1">
        <span className="text-[12px] font-medium text-black-300">
          권장 과업 시간
        </span>

        <span className="text-[11px] font-medium text-black-600">
          과업 선택하기
        </span>
      </span>

      <span className="text-[32px] font-bold text-black-100">
        {formatRecommendedTaskTime(
          recommendedMinutes ?? 0,
        )}
      </span>
    </button>
  );
}
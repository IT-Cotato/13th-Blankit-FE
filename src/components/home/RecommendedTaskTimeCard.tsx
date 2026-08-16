import { formatRecommendedTaskTime } from "@/utils/homeRecommendedTask";

interface RecommendedTaskTimeCardProps {
  recommendedMinutes: number | null;
  isStarting: boolean;
  onStart: () => void;
}

export function RecommendedTaskTimeCard({
  recommendedMinutes,
  isStarting,
  onStart,
}: RecommendedTaskTimeCardProps) {

  return (
    <section className="w-full rounded-[12px] bg-black-850 p-4">
      <p className="text-[14px] font-semibold text-black-500">
        권장 과업 시간
      </p>

      <span className="mt-2 block text-[32px] font-bold leading-none text-black-100">
        {formatRecommendedTaskTime(
          recommendedMinutes ?? 0,
        )}
      </span>

      <button
        type="button"
        disabled={isStarting}
        aria-busy={isStarting}
        onClick={onStart}
        className="mt-5 flex h-[45px] w-full items-center justify-center rounded-[8px] bg-black-750 text-[14px] font-medium text-black-200 transition-colors active:bg-black-700"
      >
        과업 시작
      </button>
    </section>
  );
}

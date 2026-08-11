import { getTaskMosaicState } from "@/utils/taskTimer";

interface TaskMosaicProgressProps {
  elapsedSeconds: number;
  recommendedMinutes: number | null;
}

const MOSAIC_SLOT_COUNT = 100;

function getMosaicSlotColorClassName(
  isCompleted: boolean,
  isOvertime: boolean,
) {
  if (!isCompleted) {
    return "bg-black-800";
  }

  if (isOvertime) {
    return "bg-orange-500";
  }

  return "bg-purple-500";
}

export function TaskMosaicProgress({
  elapsedSeconds,
  recommendedMinutes,
}: TaskMosaicProgressProps) {
  const isLoading = recommendedMinutes === null;
  const safeRecommendedMinutes =
    recommendedMinutes ?? 0;
  const recommendedSeconds = Math.max(
    0,
    safeRecommendedMinutes * 60,
  );

  const currentSeconds = Math.min(
    Math.max(0, elapsedSeconds),
    recommendedSeconds,
  );

  const { completedSlots, recommendedSlots } = isLoading
    ? { completedSlots: 0, recommendedSlots: 0 }
    : getTaskMosaicState(
        elapsedSeconds,
        safeRecommendedMinutes,
        MOSAIC_SLOT_COUNT,
      );

  return (
    <div
      role="progressbar"
      aria-label="플레이리스트 누적 진행 시간"
      aria-valuemin={0}
      aria-valuemax={recommendedSeconds}
      aria-valuenow={currentSeconds}
      aria-busy={isLoading}
      className="grid w-full max-w-[222px] grid-cols-10 gap-2"
    >
      {Array.from(
        { length: MOSAIC_SLOT_COUNT },
        (_, index) => {
          const isCompleted = index < completedSlots;
          const isOvertime =
            isCompleted && index >= recommendedSlots;

          return (
            <span
              key={index}
              aria-hidden="true"
              className={`aspect-square rounded-full transition-colors duration-300 ${getMosaicSlotColorClassName(
                isCompleted,
                isOvertime,
              )}`}
            />
          );
        },
      )}
    </div>
  );
}

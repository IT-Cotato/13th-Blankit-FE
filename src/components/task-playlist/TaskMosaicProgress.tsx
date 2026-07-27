import { getTaskMosaicState } from "@/utils/taskTimer";

interface TaskMosaicProgressProps {
  elapsedSeconds: number;
  estimatedMinutes: number;
}

const MOSAIC_SLOT_COUNT = 100;

export function TaskMosaicProgress({
  elapsedSeconds,
  estimatedMinutes,
}: TaskMosaicProgressProps) {
  const { completedSlots, recommendedSlots } =
    getTaskMosaicState(
      elapsedSeconds,
      estimatedMinutes,
      MOSAIC_SLOT_COUNT,
    );

  return (
    <div
      role="progressbar"
      aria-label="플레이리스트 누적 진행 시간"
      aria-valuemin={0}
      aria-valuemax={estimatedMinutes * 60}
      aria-valuenow={Math.min(
        elapsedSeconds,
        estimatedMinutes * 60,
      )}
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
              className={`aspect-square rounded-full transition-colors duration-300 ${
                !isCompleted
                  ? "bg-black-850"
                  : isOvertime
                    ? "bg-orange-500"
                    : "bg-purple-500"
              }`}
            />
          );
        },
      )}
    </div>
  );
}

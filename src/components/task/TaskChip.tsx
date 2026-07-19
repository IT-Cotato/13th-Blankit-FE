import mockTaskIcon from "@/assets/icons/task/mock-icon.svg";

import type {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

interface TaskChipProps {
  title: string;
  lastMemo: string | null;
  progressRate: number;
  priority: TaskPriority;
  status: TaskStatus;
  categoryIcon?: string;
  onClick?: () => void;
}

const PRIORITY_STYLES = {
  HIGH: {
    textClassName: "text-red-400",
    color: "var(--color-red-400)",
  },
  MEDIUM: {
    textClassName: "text-orange-400",
    color: "var(--color-orange-400)",
  },
  LOW: {
    textClassName: "text-lime-400",
    color: "var(--color-lime-400)",
  },
} satisfies Record<
  TaskPriority,
  {
    textClassName: string;
    color: string;
  }
>;

const PROGRESS_SIZE = 39;
const PROGRESS_STROKE_WIDTH = 3;
const PROGRESS_CENTER = PROGRESS_SIZE / 2;

const PROGRESS_RADIUS =
  (PROGRESS_SIZE - PROGRESS_STROKE_WIDTH) / 2;

const PROGRESS_CIRCUMFERENCE =
  2 * Math.PI * PROGRESS_RADIUS;

export function TaskChip({
  title,
  lastMemo,
  progressRate,
  priority,
  status,
  categoryIcon = mockTaskIcon,
  onClick,
}: TaskChipProps) {
  const clampedProgressRate = Math.min(
    100,
    Math.max(0, progressRate),
  );

  const progressLevel = Math.floor(
    clampedProgressRate / 10,
  );

  const progressOffset =
    PROGRESS_CIRCUMFERENCE *
    (1 - clampedProgressRate / 100);

  const priorityStyle = PRIORITY_STYLES[priority];
  const isDone = status === "DONE";

  const memo =
    lastMemo?.trim() || "아직 작성된 메모가 없어요";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isDone
          ? `${title}, 완료`
          : `${title}, 진행도 ${progressLevel}`
      }
      className="
        flex w-full items-center gap-4
        rounded-[12px] bg-black-850
        px-5 py-[18px] text-left
        transition-colors active:bg-black-800
      "
    >
      <img
        src={categoryIcon}
        alt=""
        className="h-10 w-10 shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate text-[14px] font-semibold
            leading-[150%] text-black-100
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5 truncate text-[12px] font-medium
            leading-[150%] text-black-600
          "
        >
          {memo}
        </p>
      </div>

      {isDone ? (
        <div
          aria-hidden="true"
          className="
            flex h-[39px] w-[39px] shrink-0
            items-center justify-center
            rounded-full bg-lime-500
          "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M3.5 10L8 14.5L16.5 4.5"
              stroke="var(--color-black-800)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="
            relative flex h-[39px] w-[39px] shrink-0
            items-center justify-center
          "
        >
          <svg
            className="absolute inset-0 -rotate-90"
            width={PROGRESS_SIZE}
            height={PROGRESS_SIZE}
            viewBox={`0 0 ${PROGRESS_SIZE} ${PROGRESS_SIZE}`}
            fill="none"
          >
            <circle
              cx={PROGRESS_CENTER}
              cy={PROGRESS_CENTER}
              r={PROGRESS_RADIUS}
              stroke="var(--color-black-800)"
              strokeWidth={PROGRESS_STROKE_WIDTH}
              fill="none"
            />

            {clampedProgressRate > 0 && (
              <circle
                cx={PROGRESS_CENTER}
                cy={PROGRESS_CENTER}
                r={PROGRESS_RADIUS}
                stroke={priorityStyle.color}
                strokeWidth={PROGRESS_STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={
                  PROGRESS_CIRCUMFERENCE
                }
                strokeDashoffset={progressOffset}
                fill="none"
              />
            )}
          </svg>

          <span
            className={`
              relative z-10 text-[16px] font-semibold
              leading-none
              ${priorityStyle.textClassName}
            `}
          >
            {progressLevel}
          </span>
        </div>
      )}
    </button>
  );
}
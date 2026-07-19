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
        rounded-[20px] bg-black-850
        px-5 py-[18px] text-left
        transition-colors active:bg-black-800
      "
    >
      <img
        src={categoryIcon}
        alt=""
        className="h-16 w-16 shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate text-[20px] font-semibold
            leading-[150%] text-black-100
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5 truncate text-[16px] font-medium
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
            flex h-16 w-16 shrink-0
            items-center justify-center
            rounded-full bg-lime-500
          "
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M7 15.5L12.5 21L23 8.5"
              stroke="var(--color-black-750)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="
            relative flex h-16 w-16 shrink-0
            items-center justify-center rounded-full
          "
          style={{
            background: `conic-gradient(
              ${priorityStyle.color} 0%,
              ${priorityStyle.color} ${clampedProgressRate}%,
              var(--color-black-750) ${clampedProgressRate}%,
              var(--color-black-750) 100%
            )`,
          }}
        >
          <div
            className="
              absolute inset-[5px]
              rounded-full bg-black-850
            "
          />

          <span
            className={`
              relative z-10 text-[24px] font-semibold
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
import type { TaskPriority } from "@/types/task";

export type PriorityTaskCardProps = {
  taskId: number;
  title: string;
  categoryName: string;
  categoryColor: string;
  priority: TaskPriority;
  progressRate?: number;
  isStarred: boolean;
  lastMemo?: string | null;
  onClick?: (taskId: number) => void;
  onStarToggle: (taskId: number) => void;
};

const priorityStyles: Record<
  TaskPriority,
  { color: string; iconClassName: string }
> = {
  HIGH: {
    color: "var(--color-red-400)",
    iconClassName: "text-red-400",
  },
  MEDIUM: {
    color: "var(--color-orange-400)",
    iconClassName: "text-orange-400",
  },
  LOW: {
    color: "var(--color-lime-400)",
    iconClassName: "text-lime-400",
  },
};

const progressRadius = 18.5;
const progressCircumference = 2 * Math.PI * progressRadius;

function PriorityProgressIcon({
  priority,
  progressRate,
}: {
  priority: TaskPriority;
  progressRate: number;
}) {
  const clampedProgressRate = Math.min(100, Math.max(0, progressRate));
  const progressOffset =
    progressCircumference * (1 - clampedProgressRate / 100);
  const priorityStyle = priorityStyles[priority];

  return (
    <span className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center gap-2.5 rounded-[100px] p-2.5">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-10 w-10 -rotate-90"
      >
        <circle
          cx="20"
          cy="20"
          r={progressRadius}
          stroke="var(--color-black-750)"
          strokeWidth="3"
        />

        {clampedProgressRate > 0 && (
          <circle
            cx="20"
            cy="20"
            r={progressRadius}
            stroke={priorityStyle.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={progressCircumference}
            strokeDashoffset={progressOffset}
          />
        )}
      </svg>

      <svg
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className={`aspect-square h-[14px] w-[14px] shrink-0 ${priorityStyle.iconClassName}`}
      >
        <path
          d="M11.1303 7.10978L10.6003 6.57977L3.1801 14H0V10.8199L8.48027 2.33961L12.7204 6.57977C13.0132 6.87247 13.0132 7.34709 12.7204 7.63979L7.42025 12.9399L6.36022 11.8799L11.1303 7.10978ZM11.6603 0.219538L13.7805 2.33961C14.0732 2.63232 14.0732 3.10692 13.7805 3.39964L12.7204 4.45967L9.5403 1.27957L10.6003 0.219538C10.8931 -0.0731792 11.3676 -0.0731792 11.6603 0.219538Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function PriorityTaskCard({
  taskId,
  title,
  categoryName,
  priority,
  progressRate = 0,
  isStarred,
  lastMemo,
  onClick,
  onStarToggle,
}: PriorityTaskCardProps) {
  const description = lastMemo?.trim() || categoryName;

  return (
    <article
      data-priority={priority}
      className="flex w-full flex-col items-start justify-center gap-[18px] rounded-xl bg-black-850 p-3"
    >
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={() => onClick?.(taskId)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
        >
          <PriorityProgressIcon
            priority={priority}
            progressRate={progressRate}
          />

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100">
              {title}
            </span>
            <span className="block truncate text-xs font-medium leading-[18px] tracking-[-0.18px] text-black-700">
              {description}
            </span>
          </span>
        </button>

        <button
          type="button"
          aria-label={`${title} 즐겨찾기 ${isStarred ? "해제" : "설정"}`}
          aria-pressed={isStarred}
          onClick={() => onStarToggle(taskId)}
          className="grid aspect-square h-8 w-8 shrink-0 place-items-center outline-none"
        >
          <img
            src={isStarred ? "/mypage/star2.svg" : "/mypage/star1.svg"}
            alt=""
            className="aspect-square h-8 w-8 shrink-0 object-contain"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

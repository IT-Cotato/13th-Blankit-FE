import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import {
  CATEGORY_ICON_MAP,
  getCategoryPresentation,
} from "@/constants/category";

import type {
  Category,
  CategoryIconKey,
} from "@/types/category";

import type {
  TaskPriority,
  TaskStatus,
} from "@/types/task";

interface TaskChipBaseProps {
  title: string;
  memo?: string | null;
  priority: TaskPriority;
  progressRate: number;
  status?: TaskStatus;
  onClick?: () => void;
}

type TaskChipCategoryProps =
  | {
      category: Category;
      categoryColor?: undefined;
      categoryIconKey?: undefined;
    }
  | {
      category?: undefined;
      categoryColor: string;
      categoryIconKey: CategoryIconKey;
    };

type TaskChipProps =
  TaskChipBaseProps &
  TaskChipCategoryProps;

const PRIORITY_STYLES: Record<
  TaskPriority,
  {
    textClassName: string;
    color: string;
  }
> = {
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
};

const PROGRESS_SIZE = 39;
const PROGRESS_STROKE_WIDTH = 3;
const PROGRESS_CENTER =
  PROGRESS_SIZE / 2;

const PROGRESS_RADIUS =
  (PROGRESS_SIZE -
    PROGRESS_STROKE_WIDTH) /
  2;

const PROGRESS_CIRCUMFERENCE =
  2 * Math.PI * PROGRESS_RADIUS;

export function TaskChip(
  props: TaskChipProps,
) {
  const {
    title,
    memo,
    priority,
    progressRate,
    status = "TODO",
    onClick,
  } = props;

  const trimmedMemo = memo?.trim();

  const categoryPresentation =
    props.category !== undefined
      ? getCategoryPresentation(
          props.category,
        )
      : {
          color: props.categoryColor,
          icon:
            CATEGORY_ICON_MAP[
              props.categoryIconKey
            ],
        };

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

  const priorityStyle =
    PRIORITY_STYLES[priority];

  const isDone = status === "DONE";

  const ariaLabel = isDone
  ? `${title}, 완료`
  : `${title}, 진행도 ${progressLevel}`;

  const content = (
    <>
      <CategoryIconBadge
        icon={categoryPresentation.icon}
        color={categoryPresentation.color}
        size={40}
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

        {trimmedMemo && (
          <p
            data-task-memo
            className="truncate text-[12px] font-medium leading-[150%] tracking-[-0.015em] text-black-650"
          >
            {trimmedMemo}
          </p>
        )}
      </div>

      {isDone ? (
        <div
          aria-hidden="true"
          className="
            flex h-[39px] w-[39px]
            shrink-0 items-center
            justify-center rounded-full
            bg-lime-500
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
            relative flex h-[39px] w-[39px]
            shrink-0 items-center
            justify-center
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
              strokeWidth={
                PROGRESS_STROKE_WIDTH
              }
              fill="none"
            />

            {clampedProgressRate > 0 && (
              <circle
                cx={PROGRESS_CENTER}
                cy={PROGRESS_CENTER}
                r={PROGRESS_RADIUS}
                stroke={
                  priorityStyle.color
                }
                strokeWidth={
                  PROGRESS_STROKE_WIDTH
                }
                strokeLinecap="round"
                strokeDasharray={
                  PROGRESS_CIRCUMFERENCE
                }
                strokeDashoffset={
                  progressOffset
                }
                fill="none"
              />
            )}
          </svg>

          <span
            className={`
              relative z-10
              text-[16px] font-semibold
              leading-none
              ${priorityStyle.textClassName}
            `}
          >
            {progressLevel}
          </span>
        </div>
      )}
    </>
  );

  const className = `
    flex w-full items-center gap-4
    rounded-[12px] bg-black-850
    px-5 py-[18px] text-left
    ${onClick ? "transition-colors active:bg-black-800" : ""}
  `;

  if (!onClick) {
    return (
      <div
        role="group"
        aria-label={ariaLabel}
        className={className}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {content}
    </button>
  );
}

import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";

interface PlaylistTaskProgressIconProps {
  icon: string;
  color: string;
  progressRate: number;
}

const PROGRESS_SIZE = 40;
const PROGRESS_STROKE_WIDTH = 3;
const PROGRESS_CENTER = PROGRESS_SIZE / 2;
const PROGRESS_RADIUS =
  (PROGRESS_SIZE - PROGRESS_STROKE_WIDTH) / 2;
const PROGRESS_CIRCUMFERENCE =
  2 * Math.PI * PROGRESS_RADIUS;

export function PlaylistTaskProgressIcon({
  icon,
  color,
  progressRate,
}: PlaylistTaskProgressIconProps) {
  const clampedProgressRate = Math.min(
    100,
    Math.max(0, progressRate),
  );
  const progressOffset =
    PROGRESS_CIRCUMFERENCE *
    (1 - clampedProgressRate / 100);

  return (
    <span
      aria-hidden="true"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
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
          stroke="var(--color-black-700)"
          strokeWidth={PROGRESS_STROKE_WIDTH}
          fill="none"
        />

        {clampedProgressRate > 0 && (
          <circle
            cx={PROGRESS_CENTER}
            cy={PROGRESS_CENTER}
            r={PROGRESS_RADIUS}
            stroke={color}
            strokeWidth={PROGRESS_STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={PROGRESS_CIRCUMFERENCE}
            strokeDashoffset={progressOffset}
            fill="none"
          />
        )}
      </svg>

      <CategoryIconBadge
        icon={icon}
        color={color}
        size={15}
        withBackground={false}
      />
    </span>
  );
}

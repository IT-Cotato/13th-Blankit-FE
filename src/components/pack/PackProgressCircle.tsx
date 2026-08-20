import { useId, type ReactNode } from "react";

interface PackProgressCircleProps {
  progress: number;
  scale?: number;
  children?: ReactNode;
}

const CIRCLE_RADIUS = 100;

export function PackProgressCircle({
  progress,
  scale = 1,
  children,
}: PackProgressCircleProps) {
  const gradientId = useId();
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const progressAngle = ((-90 - normalizedProgress * 3.6) * Math.PI) / 180;
  const statusLeft = 110 + CIRCLE_RADIUS * Math.cos(progressAngle) - 7.5;
  const statusTop = 110 + CIRCLE_RADIUS * Math.sin(progressAngle) - 7.5;

  return (
    <div
      role="progressbar"
      aria-label="과업 진행도"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedProgress}
      className="relative mx-auto shrink-0"
      style={{ width: 238 * scale, height: 238 * scale }}
    >
      <div
        className="relative h-[238px] w-[238px] origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 220 220"
          className="absolute bottom-[9px] left-[9px] h-[220px] w-[220px]"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="110"
              y1="10"
              x2="110"
              y2="210"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D6F8DD" />
              <stop offset="1" stopColor="#E1E4FD" />
            </linearGradient>
          </defs>

          <circle
            cx="110"
            cy="110"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="#282C2F"
            strokeWidth="20"
          />
          <path
            d="M 110 10 A 100 100 0 1 0 110 210 A 100 100 0 1 0 110 10"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="20"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${normalizedProgress} ${100 - normalizedProgress}`}
          />
        </svg>

        <div className="pointer-events-none absolute bottom-[9px] left-[9px] h-[220px] w-[220px]">
          <img
            src="/mypage/status.svg"
            alt=""
            aria-hidden="true"
            className="absolute h-[15px] w-[15px] [filter:drop-shadow(0_-1px_10px_rgba(0,0,0,0.15))]"
            style={{ left: statusLeft, top: statusTop }}
          />
        </div>

        {children === undefined ? null : (
          <div className="absolute bottom-[9px] left-[9px] grid h-[220px] w-[220px] place-items-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

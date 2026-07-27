const PROGRESS_MARKS = [30, 50, 70] as const;
const THUMB_WIDTH_PX = 36;
const THUMB_HALF_WIDTH_PX = THUMB_WIDTH_PX / 2;

interface FeedbackProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label: string;
  variant?: "default" | "step";
}

export function FeedbackProgressSlider({
  value,
  onChange,
  disabled = false,
  label,
  variant = "default",
}: FeedbackProgressSliderProps) {
  const boundedValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0;
  const isStepVariant = variant === "step";
  const thumbOffset =
    THUMB_HALF_WIDTH_PX -
    boundedValue * (THUMB_WIDTH_PX / 100);

  return (
    <div
      className={`${
        isStepVariant
          ? "bg-transparent p-0"
          : "rounded-[6px] bg-black-800 px-3 py-4"
      } ${
        disabled ? "opacity-45" : ""
      }`}
    >
      <div className="relative h-[30px]">
        <div
          className={`absolute left-0 right-0 top-1/2 h-4.5 -translate-y-1/2 overflow-hidden rounded-full ${
            isStepVariant
              ? "bg-black-700"
              : "bg-black-750"
          }`}
        >
          {!disabled && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-0 bg-green-500"
              style={{ width: `${boundedValue}%` }}
            />
          )}

          {PROGRESS_MARKS.map((mark) => (
            <span
              key={mark}
              aria-hidden="true"
              className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                isStepVariant
                  ? "bg-black-650"
                  : "bg-black-700"
              }`}
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 flex h-[25px] w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-black-100 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          style={{
            left: `calc(${boundedValue}% + ${thumbOffset}px)`,
          }}
        >
          <span
            aria-hidden="true"
            className="h-[10px] w-[6px] bg-black-500 [clip-path:polygon(82%_0,100%_11%,36%_50%,100%_89%,82%_100%,0_50%)]"
          />
          <span
            aria-hidden="true"
            className="h-[10px] w-[6px] bg-black-500 [clip-path:polygon(18%_0,0_11%,64%_50%,0_89%,18%_100%,100%_50%)]"
          />
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={boundedValue}
          disabled={disabled}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
      </div>

      <div className="relative mt-3 h-[18px] text-[12px] font-medium leading-[150%] text-black-650">
        {PROGRESS_MARKS.map((mark) => (
          <span
            key={mark}
            aria-hidden="true"
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${mark}%` }}
          >
            {mark}%
          </span>
        ))}
      </div>
    </div>
  );
}

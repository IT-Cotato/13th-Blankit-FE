interface FeedbackProgressSliderProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label: string;
}

export function FeedbackProgressSlider({
  value,
  onChange,
  disabled = false,
  label,
}: FeedbackProgressSliderProps) {
  return (
    <div
      className={`rounded-[8px] bg-black-750 px-3 py-4 ${
        disabled ? "opacity-45" : ""
      }`}
    >
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(Number(event.target.value))
        }
        aria-label={label}
        className="h-5 w-full cursor-pointer appearance-none rounded-full bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black-100 [&::-moz-range-track]:h-3 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-black-650 [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black-650 [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black-100"
        style={{
          background: disabled
            ? undefined
            : `linear-gradient(to right, var(--color-green-500) 0%, var(--color-green-500) ${value}%, transparent ${value}%, transparent 100%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="mt-2 grid grid-cols-3 text-center text-[11px] font-medium text-black-500"
      >
        <span>30%</span>
        <span>50%</span>
        <span>70%</span>
      </div>
    </div>
  );
}

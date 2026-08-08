const COLORS = [
  "#FC5F5F",
  "#FF9A33",
  "#D3FB65",
  "#5BE478",
  "#B3BBFA",
  "#ACB1B6",
];

type TimeTableColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function TimeTableColorPicker({
  value,
  onChange,
}: TimeTableColorPickerProps) {
  return (
    <fieldset className="w-full self-stretch border-0 p-0">
      <legend className="w-full text-left text-sm font-semibold leading-[150%] tracking-[-0.21px] text-black-100">
        색상
      </legend>

      <div className="mt-2 flex w-full items-center justify-between">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`색상 ${color} 선택`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full [aspect-ratio:1/1] ${
              value === color ? "bg-black-100" : "bg-black-750"
            }`}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-full border-2 border-black-850 [aspect-ratio:1/1]"
              style={{ backgroundColor: color }}
            >
              {value === color && (
                <img
                  src="/mypage/selected.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-3 w-[13px] object-contain"
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

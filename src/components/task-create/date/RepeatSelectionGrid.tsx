import {
  DAY_OF_MONTH_VALUES,
  MONTH_VALUES,
  WEEKDAY_VALUES,
} from "./repeatTypes";

import type {
  MonthIndex,
  RepeatDay,
  Weekday,
} from "./repeatTypes";

interface SelectionButtonProps {
  selected: boolean;
  label: string;
  onClick: () => void;
  calendarStyle?: boolean;
  wide?: boolean;
}

interface WeeklySelectionGridProps {
  selectedWeekdays: Weekday[];
  onToggle: (weekday: Weekday) => void;
}

interface MonthSelectionGridProps {
  selectedMonth: MonthIndex | null;
  onSelect: (month: MonthIndex) => void;
}

interface DaySelectionGridProps {
  selectedDays: RepeatDay[];
  showWeekdays?: boolean;
  onToggle: (day: RepeatDay) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS: Array<{ value: Weekday; label: string }> =
  WEEKDAY_VALUES.map((value, index) => ({
    value,
    label: WEEKDAY_LABELS[index],
  }));
const MONTH_DAYS: readonly RepeatDay[] = [
  ...DAY_OF_MONTH_VALUES,
  "last",
];

function SelectionButton({
  selected,
  label,
  onClick,
  calendarStyle = false,
  wide = false,
}: SelectionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 items-center justify-center whitespace-nowrap rounded-[6px] ${
        calendarStyle
          ? "h-[35px] w-full px-2 text-[13px]"
          : "aspect-square w-full px-0 text-[14px] leading-[150%] tracking-[-0.015em]"
      } ${wide ? "col-span-2" : ""} ${
        selected
          ? calendarStyle
            ? "bg-green-500 font-semibold text-black-900"
            : "bg-green-500 font-semibold text-black-850"
          : calendarStyle
            ? "bg-black-700/50 font-medium text-black-300"
            : "bg-transparent font-medium text-black-600"
      }`}
    >
      {label}
    </button>
  );
}

export function WeeklySelectionGrid({
  selectedWeekdays,
  onToggle,
}: WeeklySelectionGridProps) {
  return (
    <div className="mt-3 grid grid-cols-7 gap-1 rounded-[8px] bg-black-750 p-2">
      {WEEKDAYS.map((weekday) => (
        <SelectionButton
          key={weekday.value}
          label={weekday.label}
          selected={selectedWeekdays.includes(weekday.value)}
          onClick={() => onToggle(weekday.value)}
        />
      ))}
    </div>
  );
}

export function MonthSelectionGrid({
  selectedMonth,
  onSelect,
}: MonthSelectionGridProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {MONTH_VALUES.map((month) => (
        <SelectionButton
          key={month}
          label={`${month + 1}`}
          selected={selectedMonth === month}
          calendarStyle
          onClick={() => onSelect(month)}
        />
      ))}
    </div>
  );
}

export function DaySelectionGrid({
  selectedDays,
  showWeekdays = false,
  onToggle,
}: DaySelectionGridProps) {
  return (
    <>
      {showWeekdays && (
        <div className="mb-2 grid h-[35px] grid-cols-7 gap-2">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday.value}
              className="flex items-center justify-center text-[13px] font-medium text-black-650"
            >
              {weekday.label}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {MONTH_DAYS.map((day) => (
          <SelectionButton
            key={day}
            label={day === "last" ? "마지막 날" : `${day}`}
            selected={selectedDays.includes(day)}
            calendarStyle
            wide={day === "last"}
            onClick={() => onToggle(day)}
          />
        ))}
        {showWeekdays &&
          Array.from({ length: 2 }, (_, index) => (
            <span
              key={`monthly-empty-${index}`}
              aria-hidden="true"
              className="flex h-[35px] w-full items-center justify-center"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-black-700" />
            </span>
          ))}
      </div>
    </>
  );
}

import selectIcon from "@/assets/icons/select-button-650.svg";

import {
  DaySelectionGrid,
  MonthSelectionGrid,
  WeeklySelectionGrid,
} from "./RepeatSelectionGrid";
import { RepeatTypeSelect } from "./RepeatTypeSelect";
import { formatFullDate } from "./utils/calendar";
import { createRepeatPattern } from "./utils/repeat";

import type {
  RepeatDay,
  RepeatSettingsDraft,
  Weekday,
} from "./repeatTypes";

interface RepeatSettingsFormProps {
  settings: RepeatSettingsDraft;
  onChange: (settings: RepeatSettingsDraft) => void;
  onSelectStartDate: () => void;
  onSelectEndDate: () => void;
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

export function RepeatSettingsForm({
  settings,
  onChange,
  onSelectStartDate,
  onSelectEndDate,
}: RepeatSettingsFormProps) {
  const { pattern } = settings;

  function toggleWeekday(weekday: Weekday) {
    if (pattern.type !== "weekly") {
      return;
    }

    onChange({
      ...settings,
      pattern: {
        type: "weekly",
        weekdays: toggleValue(pattern.weekdays, weekday),
      },
    });
  }

  function toggleDay(day: RepeatDay) {
    if (pattern.type === "weekly") {
      return;
    }

    onChange({
      ...settings,
      pattern: {
        ...pattern,
        days: toggleValue(pattern.days, day),
      },
    });
  }

  return (
    <div className="mt-5 rounded-[12px] bg-black-800 p-3">
      <div className="flex h-8 items-center justify-between">
        <span className="p-2 text-[14px] font-medium text-black-100">
          반복 유형
        </span>
        <RepeatTypeSelect
          value={pattern.type}
          onChange={(type) =>
            onChange({
              ...settings,
              pattern: createRepeatPattern(type),
            })
          }
        />
      </div>

      {pattern.type === "weekly" && (
        <WeeklySelectionGrid
          selectedWeekdays={pattern.weekdays}
          onToggle={toggleWeekday}
        />
      )}

      {pattern.type === "monthly" && (
        <div className="mt-3 rounded-[12px] bg-black-750/50 p-4">
          <DaySelectionGrid
            selectedDays={pattern.days}
            showWeekdays
            onToggle={toggleDay}
          />
        </div>
      )}

      {pattern.type === "yearly" && (
        <>
          <div className="mt-3 rounded-[12px] bg-black-750/50 p-4">
            <p className="mb-3 text-[14px] font-medium text-black-100">
              월 선택
            </p>
            <MonthSelectionGrid
              selectedMonth={pattern.month}
              onSelect={(month) =>
                onChange({
                  ...settings,
                  pattern: {
                    ...pattern,
                    month,
                  },
                })
              }
            />
          </div>

          <div className="mt-3 rounded-[12px] bg-black-750/50 p-4">
            <p className="mb-3 text-[14px] font-medium text-black-100">
              일 선택
            </p>
            <DaySelectionGrid
              selectedDays={pattern.days}
              onToggle={toggleDay}
            />
          </div>
        </>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSelectStartDate}
          className="flex h-11 items-center justify-between rounded-[5px] px-2 text-[14px]"
        >
          <span className="font-medium text-black-300">시작 날짜</span>
          <span className="flex h-8 items-center gap-2 rounded-[5px] bg-black-750 px-2 font-medium text-black-400">
            {formatFullDate(settings.startDate, "선택")}
            <img src={selectIcon} alt="" className="h-[7px] w-3" />
          </span>
        </button>
        <button
          type="button"
          disabled={!settings.startDate}
          onClick={onSelectEndDate}
          className="flex h-11 items-center justify-between rounded-[5px] px-2 text-[14px] disabled:cursor-not-allowed"
        >
          <span className="font-medium text-black-300">종료 날짜</span>
          <span
            className={`flex h-8 items-center gap-2 rounded-[5px] bg-black-750 px-2 font-medium text-black-400 ${
              settings.startDate ? "" : "opacity-40"
            }`}
          >
            {formatFullDate(settings.endDate, "선택")}
            <img src={selectIcon} alt="" className="h-[7px] w-3" />
          </span>
        </button>
      </div>
    </div>
  );
}

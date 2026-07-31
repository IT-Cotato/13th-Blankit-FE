import { useMemo, useRef, useState } from "react";

import { MonthYearPicker } from "./MonthYearPicker";
import {
  addMonths,
  formatMonth,
  getCalendarCells,
  isSameDate,
  startOfDay,
  startOfMonth,
} from "./utils/calendar";

interface CalendarPanelProps {
  selectedDate: Date | null;
  minSelectableDate?: Date | null;
  onSelect: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPanel({
  selectedDate,
  minSelectableDate = null,
  onSelect,
}: CalendarPanelProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const normalizedMinSelectableDate = useMemo(
    () =>
      minSelectableDate ? startOfDay(minSelectableDate) : null,
    [minSelectableDate],
  );
  const minMonth = useMemo(() => {
    if (normalizedMinSelectableDate) {
      return startOfMonth(normalizedMinSelectableDate);
    }

    if (selectedDate && selectedDate < today) {
      return startOfMonth(selectedDate);
    }

    return startOfMonth(today);
  }, [normalizedMinSelectableDate, selectedDate, today]);
  const maxMonth = useMemo(
    () => new Date(today.getFullYear() + 3, today.getMonth(), 1),
    [today],
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate ?? normalizedMinSelectableDate ?? today),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const swipeRef = useRef({
    startX: null as number | null,
    suppressClickUntil: 0,
  });
  const cells = getCalendarCells(visibleMonth);

  function moveMonth(amount: number) {
    const nextMonth = addMonths(visibleMonth, amount);

    if (nextMonth < minMonth || nextMonth > maxMonth) {
      return;
    }

    setVisibleMonth(nextMonth);
  }

  return (
    <>
      {!pickerOpen && (
        <button
          type="button"
          aria-expanded={pickerOpen}
          onClick={() => setPickerOpen(true)}
          className="mt-5 self-start text-[16px] font-semibold text-black-300"
        >
          {formatMonth(visibleMonth)}
        </button>
      )}

      {pickerOpen && (
        <div className="mt-5 shrink-0">
          <MonthYearPicker
            year={visibleMonth.getFullYear()}
            month={visibleMonth.getMonth()}
            minMonth={minMonth}
            maxMonth={maxMonth}
            onChange={(year, month) =>
              setVisibleMonth(new Date(year, month, 1))
            }
          />
        </div>
      )}

      <div
        className={`${pickerOpen ? "mt-4" : "mt-5"} touch-pan-y shrink-0 rounded-[12px] bg-black-800 p-4.5`}
        onTouchStart={(event) => {
          swipeRef.current = {
            startX: event.touches[0]?.clientX ?? null,
            suppressClickUntil: swipeRef.current.suppressClickUntil,
          };
        }}
        onTouchEnd={(event) => {
          const startX = swipeRef.current.startX;

          if (startX === null) {
            return;
          }

          const endX = event.changedTouches[0]?.clientX ?? startX;
          const distance = endX - startX;
          swipeRef.current.startX = null;

          if (Math.abs(distance) >= 40) {
            swipeRef.current.suppressClickUntil = Date.now() + 350;
            moveMonth(distance < 0 ? 1 : -1);
          }
        }}
        onClickCapture={(event) => {
          if (Date.now() < swipeRef.current.suppressClickUntil) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <div className="grid h-[37px] grid-cols-7 gap-x-2">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="flex items-center justify-center text-[14px] font-medium text-black-700"
            >
              {weekday}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-x-2 gap-y-2.5">
          {cells.map((cell) => {
            if (cell.kind === "empty") {
              return (
                <span
                  key={cell.key}
                  aria-hidden="true"
                  className="flex h-[37px] w-full items-center justify-center text-black-750"
                >
                  ·
                </span>
              );
            }

            const disabled =
              normalizedMinSelectableDate !== null &&
              cell.date < normalizedMinSelectableDate;

            return (
              <button
                key={cell.key}
                type="button"
                disabled={disabled}
                aria-label={`${cell.date.getFullYear()}년 ${
                  cell.date.getMonth() + 1
                }월 ${cell.day}일`}
                aria-pressed={isSameDate(selectedDate, cell.date)}
                onClick={() => onSelect(cell.date)}
                className={`flex h-[37px] w-full items-center justify-center rounded-[6px] px-2.5 text-[14px] font-medium leading-[150%] ${
                  isSameDate(selectedDate, cell.date)
                    ? "bg-green-500 text-black-900"
                    : "bg-[rgba(60,63,67,0.5)] text-black-300 disabled:text-black-700"
                }`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

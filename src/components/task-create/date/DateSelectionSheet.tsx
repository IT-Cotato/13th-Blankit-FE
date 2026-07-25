import { useMemo, useRef, useState } from "react";

import backIcon from "@/assets/icons/back-button-black-600.svg";

import { MonthYearPicker } from "./MonthYearPicker";
import {
  addMonths,
  formatMonth,
  getCalendarCells,
  isSameDate,
  startOfMonth,
} from "./dateUtils";

interface DateSelectionSheetProps {
  initialDate: Date | null;
  onBack: () => void;
  onConfirm: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DateSelectionSheet({
  initialDate,
  onBack,
  onConfirm,
}: DateSelectionSheetProps) {
  const today = useMemo(() => new Date(), []);
  const minMonth = useMemo(() => startOfMonth(today), [today]);
  const maxMonth = useMemo(
    () => new Date(today.getFullYear() + 3, today.getMonth(), 1),
    [today],
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(initialDate ?? today),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [pickerOpen, setPickerOpen] = useState(false);
  const calendarSwipeRef = useRef({
    startX: null as number | null,
    dragged: false,
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
    <section
      role="dialog"
      aria-modal="true"
      aria-label="날짜 선택"
      className="fixed bottom-0 left-1/2 z-[70] flex max-h-[calc(100dvh-16px)] w-full max-w-[375px] -translate-x-1/2 flex-col rounded-t-[20px] bg-black-850 p-5 shadow-[0_10px_60px_rgba(0,0,0,0.6)]"
    >
      <header className="grid h-6 shrink-0 grid-cols-[24px_1fr_24px] items-center">
        <button
          type="button"
          aria-label="과업 입력으로 돌아가기"
          onClick={onBack}
          className="flex h-6 w-6 items-center justify-center"
        >
          <img src={backIcon} alt="" className="h-3 w-2" />
        </button>
        <h2 className="text-center text-[16px] font-medium text-black-100">
          날짜 선택
        </h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="날짜 유형"
          className="mt-5 grid h-11 grid-cols-2 rounded-full bg-black-800 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="rounded-full bg-black-700 text-[14px] font-medium text-black-200"
          >
            일반
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            disabled
            className="cursor-default rounded-full text-[14px] font-medium text-black-200"
          >
            반복
          </button>
        </div>

        {!pickerOpen && (
          <button
            type="button"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((current) => !current)}
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
          className={`${pickerOpen ? "mt-4" : "mt-5"} shrink-0 rounded-[12px] bg-black-800 p-4.5`}
          onTouchStart={(event) => {
            calendarSwipeRef.current = {
              startX: event.touches[0]?.clientX ?? null,
              dragged: false,
            };
          }}
          onTouchMove={(event) => {
            const startX = calendarSwipeRef.current.startX;
            const currentX = event.touches[0]?.clientX;

            if (
              startX !== null &&
              currentX !== undefined &&
              Math.abs(currentX - startX) > 8
            ) {
              calendarSwipeRef.current.dragged = true;
            }
          }}
          onTouchEnd={(event) => {
            const startX = calendarSwipeRef.current.startX;

            if (startX === null) {
              return;
            }

            const endX = event.changedTouches[0]?.clientX ?? startX;
            const distance = endX - startX;
            calendarSwipeRef.current.startX = null;

            if (Math.abs(distance) >= 40) {
              moveMonth(distance < 0 ? 1 : -1);
            }

            window.setTimeout(() => {
              calendarSwipeRef.current.dragged = false;
            }, 0);
          }}
          onClickCapture={(event) => {
            if (calendarSwipeRef.current.dragged) {
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
            {cells.map((cell) =>
              cell.kind === "date" ? (
                <button
                  key={cell.key}
                  type="button"
                  aria-label={`${cell.date.getFullYear()}년 ${
                    cell.date.getMonth() + 1
                  }월 ${cell.day}일`}
                  aria-pressed={isSameDate(selectedDate, cell.date)}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`flex h-[37px] w-full items-center justify-center rounded-[6px] px-2.5 py-3 text-[14px] font-medium leading-[13px] ${
                    isSameDate(selectedDate, cell.date)
                      ? "bg-green-500 text-black-900"
                      : "bg-[rgba(60,63,67,0.5)] text-black-300"
                  }`}
                >
                  {cell.day}
                </button>
              ) : (
                <span
                  key={cell.key}
                  aria-hidden="true"
                  className="flex h-[37px] w-full items-center justify-center text-black-750"
                >
                  ·
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 pt-5">
        <button
          type="button"
          disabled={!selectedDate}
          onClick={() => {
            if (selectedDate) {
              onConfirm(selectedDate);
            }
          }}
          className="h-12 w-full rounded-[6px] bg-black-800 text-[14px] font-semibold text-black-200 disabled:cursor-not-allowed disabled:text-black-650"
        >
          완료
        </button>
      </div>
    </section>
  );
}

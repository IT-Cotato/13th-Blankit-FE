import { useState } from "react";

import backIcon from "@/assets/icons/back-button-black-600.svg";

import { DateCalendar } from "./DateCalendar";
import { startOfDay } from "./utils/calendar";

interface RepeatDatePickerSheetProps {
  initialDate: Date | null;
  minDate?: Date | null;
  onBack: () => void;
  onConfirm: (date: Date) => void;
}

export function RepeatDatePickerSheet({
  initialDate,
  minDate = null,
  onBack,
  onConfirm,
}: RepeatDatePickerSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const normalizedMinDate = minDate ? startOfDay(minDate) : null;
  const canConfirm =
    selectedDate !== null &&
    (normalizedMinDate === null ||
      startOfDay(selectedDate) >= normalizedMinDate);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="반복 날짜 선택"
      className="fixed bottom-0 left-1/2 z-[80] flex max-h-[calc(100dvh-16px)] w-full -translate-x-1/2 flex-col rounded-t-[20px] bg-black-850 p-5 shadow-[0_10px_60px_rgba(0,0,0,0.6)] sm:max-w-[375px]"
    >
      <header className="grid h-6 shrink-0 grid-cols-[24px_1fr_24px] items-center">
        <button
          type="button"
          aria-label="반복 설정으로 돌아가기"
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
        <DateCalendar
          selectedDate={selectedDate}
          minSelectableDate={minDate}
          onSelect={setSelectedDate}
        />
      </div>

      <div className="shrink-0 pt-5">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => {
            if (selectedDate && canConfirm) {
              onConfirm(selectedDate);
            }
          }}
          className="
            h-12 w-full rounded-[8px]
            bg-green-500
            text-center text-[14px] font-semibold leading-[150%] tracking-[-0.015em]
            text-black-900
            disabled:cursor-not-allowed
            disabled:bg-black-800
            disabled:font-medium
            disabled:text-black-650
            "
        >
          완료
        </button>
      </div>
    </section>
  );
}

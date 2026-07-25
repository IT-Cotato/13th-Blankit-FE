import { useState } from "react";

import backIcon from "@/assets/icons/back-button-black-600.svg";

import { CalendarPanel } from "./CalendarPanel";

interface CalendarPickerSheetProps {
  initialDate: Date | null;
  minDate?: Date | null;
  onBack: () => void;
  onConfirm: (date: Date) => void;
}

export function CalendarPickerSheet({
  initialDate,
  minDate = null,
  onBack,
  onConfirm,
}: CalendarPickerSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

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
        <CalendarPanel
          selectedDate={selectedDate}
          minSelectableDate={minDate}
          onSelect={setSelectedDate}
        />
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

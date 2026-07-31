import { useMemo, useState } from "react";

import backIcon from "@/assets/icons/back-button-black-600.svg";

import { CalendarPanel } from "./CalendarPanel";
import { CalendarPickerSheet } from "./CalendarPickerSheet";
import { RepeatSettingsForm } from "./RepeatSettingsForm";
import {
  cloneRepeatPattern,
  createRepeatDraft,
  isRepeatSettingsComplete,
} from "./utils/repeat";

import type { RepeatSettings } from "./repeatTypes";

interface DateSelectionSheetProps {
  initialDate: Date | null;
  initialRepeat: RepeatSettings | null;
  onBack: () => void;
  onConfirm: (date: Date) => void;
  onConfirmRepeat: (settings: RepeatSettings) => void;
}

type DateTab = "general" | "repeat";
type RepeatDateTarget = "start" | "end";

export function DateSelectionSheet({
  initialDate,
  initialRepeat,
  onBack,
  onConfirm,
  onConfirmRepeat,
}: DateSelectionSheetProps) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [activeTab, setActiveTab] = useState<DateTab>(
    initialRepeat ? "repeat" : "general",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [repeatSettings, setRepeatSettings] = useState(() =>
    createRepeatDraft(initialRepeat),
  );
  const [repeatDateTarget, setRepeatDateTarget] =
    useState<RepeatDateTarget | null>(null);
  const repeatComplete = isRepeatSettingsComplete(repeatSettings);

  if (repeatDateTarget) {
    const selectingEndDate = repeatDateTarget === "end";

    return (
      <CalendarPickerSheet
        initialDate={
          selectingEndDate
            ? repeatSettings.endDate
            : repeatSettings.startDate
        }
        minDate={selectingEndDate ? repeatSettings.startDate : today}
        onBack={() => setRepeatDateTarget(null)}
        onConfirm={(date) => {
          setRepeatSettings((current) => {
            if (repeatDateTarget === "start") {
              return {
                ...current,
                startDate: date,
                endDate:
                  current.endDate && current.endDate >= date
                    ? current.endDate
                    : null,
              };
            }

            return {
              ...current,
              endDate: date,
            };
          });
          setRepeatDateTarget(null);
        }}
      />
    );
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="날짜 선택"
      className="fixed bottom-0 left-1/2 z-[70] flex max-h-[calc(100dvh-16px)] w-full -translate-x-1/2 flex-col rounded-t-[20px] bg-black-850 p-5 shadow-[0_10px_60px_rgba(0,0,0,0.6)] sm:max-w-[375px]"
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
            aria-selected={activeTab === "general"}
            onClick={() => setActiveTab("general")}
            className={`rounded-full text-[14px] font-medium ${
              activeTab === "general"
                ? "bg-black-700 text-black-200"
                : "text-black-400"
            }`}
          >
            일반
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "repeat"}
            onClick={() => setActiveTab("repeat")}
            className={`rounded-full text-[14px] font-medium ${
              activeTab === "repeat"
                ? "bg-black-700 text-black-200"
                : "text-black-400"
            }`}
          >
            반복
          </button>
        </div>

        {activeTab === "general" ? (
          <CalendarPanel
            selectedDate={selectedDate}
            minSelectableDate={today}
            onSelect={setSelectedDate}
          />
        ) : (
          <RepeatSettingsForm
            settings={repeatSettings}
            onChange={setRepeatSettings}
            onSelectStartDate={() => setRepeatDateTarget("start")}
            onSelectEndDate={() => setRepeatDateTarget("end")}
          />
        )}
      </div>

      <div className="shrink-0 pt-5">
        <button
          type="button"
          disabled={
            activeTab === "general" ? !selectedDate : !repeatComplete
          }
          onClick={() => {
            if (activeTab === "general") {
              if (selectedDate) {
                onConfirm(selectedDate);
              }
              return;
            }

            if (
              repeatComplete &&
              repeatSettings.startDate
            ) {
              onConfirmRepeat({
                startDate: repeatSettings.startDate,
                endDate: repeatSettings.endDate,
                pattern: cloneRepeatPattern(repeatSettings.pattern),
              });
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

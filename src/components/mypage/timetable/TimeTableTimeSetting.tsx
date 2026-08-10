import { useState } from "react";

import { useTimeTableStore } from "@/store/useTimeTableStore";
import { updateTimetableSettings } from "@/api/mypage/timetable";
import { formatTimetableSettingHour } from "@/utils/timetableApiMapper";

const TIME_OPTIONS = Array.from(
  { length: 25 },
  (_, hour) => `${String(hour).padStart(2, "0")}:00`,
);

type OpenPicker = "start" | "end" | null;

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type TimePickerProps = {
  label: string;
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

function TimePicker({
  label,
  value,
  isOpen,
  onToggle,
  onChange,
}: TimePickerProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex h-8 w-full items-center justify-between rounded-md bg-black-800 px-3 text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600 outline-none focus-visible:outline-2 focus-visible:outline-green-500"
      >
        <span>{value}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={`${label} 목록`}
          className="absolute left-0 top-[36px] z-20 flex h-[105px] w-full max-w-[140px] flex-col items-start overflow-y-auto rounded-md bg-black-750 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TIME_OPTIONS.map((time) => (
            <button
              key={time}
              type="button"
              role="option"
              aria-selected={time === value}
              onClick={() => onChange(time)}
              className={`flex h-[35px] min-h-[35px] w-full shrink-0 items-center justify-center text-center text-sm font-medium leading-[150%] tracking-[-0.21px] outline-none hover:bg-black-800 focus-visible:bg-black-800 ${
                time === value ? "text-black-200" : "text-black-650"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimeTableTimeSetting() {
  const startHour = useTimeTableStore((state) => state.startHour);
  const endHour = useTimeTableStore((state) => state.endHour);
  const setStartHour = useTimeTableStore((state) => state.setStartHour);
  const setEndHour = useTimeTableStore((state) => state.setEndHour);
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const startTime = `${String(startHour).padStart(2, "0")}:00`;
  const endTime = `${String(endHour).padStart(2, "0")}:00`;

  const saveTimeRange = async (nextStartHour: number, nextEndHour: number) => {
    try {
      await updateTimetableSettings({
        startTime: formatTimetableSettingHour(nextStartHour),
        endTime: formatTimetableSettingHour(nextEndHour),
      });
    } catch (error) {
      console.error("시간표 표시 범위 수정 API 호출에 실패했습니다.", error);
    }
  };

  return (
    <section className="flex w-full flex-col items-start">
      <h2 className="w-full flex-1 text-left text-base font-semibold leading-[150%] tracking-[-0.24px] text-black-100">
        시간표 시간
      </h2>

      <div className="mt-2 w-full rounded-xl bg-black-850 p-3 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)]">
        <p className="text-left text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-100">
          시작시간 - 종료시간
        </p>

        <div className="mt-3 flex w-full items-center gap-3">
          <TimePicker
            label="시작 시간 선택"
            value={startTime}
            isOpen={openPicker === "start"}
            onToggle={() =>
              setOpenPicker((current) =>
                current === "start" ? null : "start",
              )
            }
            onChange={(time) => {
              const nextStartHour = Number(time.slice(0, 2));
              const nextEndHour = nextStartHour >= endHour
                ? Math.min(24, nextStartHour + 1)
                : endHour;
              setStartHour(nextStartHour);
              void saveTimeRange(nextStartHour, nextEndHour);
              setOpenPicker(null);
            }}
          />

          <span className="shrink-0 text-sm text-black-700">-</span>

          <TimePicker
            label="종료 시간 선택"
            value={endTime}
            isOpen={openPicker === "end"}
            onToggle={() =>
              setOpenPicker((current) =>
                current === "end" ? null : "end",
              )
            }
            onChange={(time) => {
              const nextEndHour = Number(time.slice(0, 2));
              const nextStartHour = nextEndHour <= startHour
                ? Math.max(0, nextEndHour - 1)
                : startHour;
              setEndHour(nextEndHour);
              void saveTimeRange(nextStartHour, nextEndHour);
              setOpenPicker(null);
            }}
          />
        </div>
      </div>
    </section>
  );
}

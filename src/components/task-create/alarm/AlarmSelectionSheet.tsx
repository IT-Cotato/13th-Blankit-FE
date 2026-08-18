import type { AlarmOption } from "./alarmOptions";

interface AlarmSelectionSheetProps {
  options: readonly AlarmOption[];
  selectedAlarm: AlarmOption;
  onSelect: (alarm: AlarmOption) => void;
  onClose: () => void;
}

export function AlarmSelectionSheet({
  options,
  selectedAlarm,
  onSelect,
  onClose,
}: AlarmSelectionSheetProps) {
  return (
    <>
      <button
        type="button"
        aria-label="알림 선택 닫기"
        onClick={onClose}
        className="fixed inset-0 z-[65] cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="알림 선택"
        className="fixed bottom-0 left-1/2 z-[70] flex min-h-[260px] w-full -translate-x-1/2 flex-col rounded-t-[20px] bg-black-850 px-5 pb-[calc(48px+env(safe-area-inset-bottom))] pt-5 shadow-[0_10px_60px_rgba(0,0,0,0.6)]"
      >
        <h2 className="text-center text-[16px] font-medium leading-[150%] text-black-100">
          일정 알림
        </h2>

        <div className="mt-10 flex flex-col items-center gap-3">
          {options.map((alarm) => {
            const selected =
              alarm === selectedAlarm;

            return (
              <button
                key={alarm}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onSelect(alarm)
                }
                className={`h-12 w-full text-center text-[18px] leading-[150%] transition-colors ${
                  selected
                    ? "font-semibold text-black-200"
                    : "font-medium text-black-650"
                }`}
              >
                {alarm} (AM 9:00)
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
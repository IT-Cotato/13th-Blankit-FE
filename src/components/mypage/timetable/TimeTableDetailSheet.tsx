import type { TimeTableEntry } from "@/store/useTimeTableStore";

type TimeTableDetailSheetProps = {
  entries: TimeTableEntry[];
  startHour: number;
  onClose: () => void;
  onEdit: (entries: TimeTableEntry[]) => void;
  onDelete: () => void;
};

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatSlot(slot: number, startHour: number) {
  const minutes = startHour * 60 + slot * 5;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function TimeTableDetailSheet({
  entries,
  startHour,
  onClose,
  onEdit,
  onDelete,
}: TimeTableDetailSheetProps) {
  const firstEntry = entries[0];
  if (!firstEntry) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60" onClick={onClose}>
      <section
        aria-label="일정 상세"
        className="flex w-full flex-col items-start gap-5 rounded-t-xl bg-black-850 px-5 pb-5 pt-[21px] shadow-[0_-10px_60px_rgba(0,0,0,0.6)]"
        style={{ minHeight: "27.15dvh" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-col">
          <h2 className="self-stretch text-left text-lg font-semibold leading-[27px] tracking-[-0.27px] text-black-100">
            {firstEntry.title}
          </h2>
          <p className="text-left text-sm font-normal leading-[21px] tracking-[-0.21px] text-black-600">
            {entries.map((entry) => (
              <span key={entry.id} className="mr-2 inline-block">
                {DAY_LABELS[entry.dayIndex]} {formatSlot(entry.startSlot, startHour)}-{formatSlot(entry.endSlot + 1, startHour)}
              </span>
            ))}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => onEdit(entries)}
            className="flex h-12 w-full shrink-0 flex-col items-center justify-center gap-2.5 rounded-lg bg-black-800 px-[50px] text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-12 w-full shrink-0 flex-col items-center justify-center gap-2.5 rounded-lg bg-black-800 px-[50px] text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
          >
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}

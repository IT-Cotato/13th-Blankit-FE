import { useState, type PointerEvent } from "react";

import {
  useTimeTableStore,
  type TimeTableEntry,
} from "@/store/useTimeTableStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type TimeRange = Omit<TimeTableEntry, "id">;

type WeeklyTimeTableProps = {
  interactive?: boolean;
  entries?: TimeRange[];
  backgroundEntries?: TimeRange[];
  onEntriesChange?: (entries: TimeRange[]) => void;
  onEntryClick?: (entryIndex: number) => void;
};

type DragSelection = {
  dayIndex: number;
  startSlot: number;
  currentSlot: number;
};

function toggleTimeRange(
  entries: TimeRange[],
  toggledRange: TimeRange,
  timeSlotCount: number,
) {
  const selectedSlots = new Set<string>();

  entries.forEach((entry) => {
    for (let slot = entry.startSlot; slot <= entry.endSlot; slot += 1) {
      selectedSlots.add(`${entry.dayIndex}-${slot}`);
    }
  });

  const toggledSlots = Array.from(
    { length: toggledRange.endSlot - toggledRange.startSlot + 1 },
    (_, index) => toggledRange.startSlot + index,
  );
  const shouldRemove = toggledSlots.every((slot) =>
    selectedSlots.has(`${toggledRange.dayIndex}-${slot}`),
  );

  toggledSlots.forEach((slot) => {
    const key = `${toggledRange.dayIndex}-${slot}`;
    if (shouldRemove) selectedSlots.delete(key);
    else selectedSlots.add(key);
  });

  const nextEntries: TimeRange[] = [];

  DAYS.forEach((_, dayIndex) => {
    let rangeStart: number | null = null;

    for (let slot = 0; slot <= timeSlotCount; slot += 1) {
      const isSelected = selectedSlots.has(`${dayIndex}-${slot}`);

      if (isSelected && rangeStart === null) rangeStart = slot;
      if (!isSelected && rangeStart !== null) {
        nextEntries.push({ dayIndex, startSlot: rangeStart, endSlot: slot - 1 });
        rangeStart = null;
      }
    }
  });

  return nextEntries;
}

export function WeeklyTimeTable({
  interactive = false,
  entries = [],
  backgroundEntries = [],
  onEntriesChange,
  onEntryClick,
}: WeeklyTimeTableProps) {
  const startHour = useTimeTableStore((state) => state.startHour);
  const endHour = useTimeTableStore((state) => state.endHour);
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => index + startHour,
  );
  const halfHourSlotCount = hours.length * 2;
  const timeSlotCount = halfHourSlotCount * 6;
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);

  const getGridPosition = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width - 1);
    const relativeY = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height - 1);

    return {
      dayIndex: Math.floor((relativeX / bounds.width) * DAYS.length),
      slotIndex:
        Math.floor((relativeY / bounds.height) * halfHourSlotCount) * 6,
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const { dayIndex, slotIndex } = getGridPosition(event);
    setDragSelection({ dayIndex, startSlot: slotIndex, currentSlot: slotIndex });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragSelection) return;

    const { slotIndex } = getGridPosition(event);
    setDragSelection((current) =>
      current ? { ...current, currentSlot: slotIndex } : current,
    );
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragSelection) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const startSlot = Math.min(dragSelection.startSlot, dragSelection.currentSlot);
    const endSlot =
      Math.max(dragSelection.startSlot, dragSelection.currentSlot) + 5;
    onEntriesChange?.(
      toggleTimeRange(entries, {
        dayIndex: dragSelection.dayIndex,
        startSlot,
        endSlot,
      }, timeSlotCount),
    );
    setDragSelection(null);
  };

  const visibleEntries = dragSelection
    ? toggleTimeRange(entries, {
        dayIndex: dragSelection.dayIndex,
        startSlot: Math.min(dragSelection.startSlot, dragSelection.currentSlot),
        endSlot: Math.max(dragSelection.startSlot, dragSelection.currentSlot) + 5,
      }, timeSlotCount)
    : entries;

  return (
    <section
      aria-label="주간 시간표"
      className="flex h-full min-h-0 w-full flex-none flex-col items-start"
    >
      <div
        aria-label="요일"
        className="flex w-full shrink-0 items-center self-stretch"
        style={{ height: "32px" }}
      >
        <span className="min-w-0 flex-1" aria-hidden="true" />
        {DAYS.map((day) => (
          <span
            key={day}
            className="min-w-0 flex-1 text-center text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-700"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="flex min-h-0 w-full flex-1">
        <div
          aria-label="시간"
          className="relative h-full shrink-0 bg-black-900"
          style={{ width: "12.5%" }}
        >
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute left-0 flex w-full -translate-y-1/2 items-center text-left text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-700"
              style={{
                top: `${((index + 0.5) / hours.length) * 100}%`,
              }}
            >
              {hour}:00
            </div>
          ))}
        </div>

        <div
          aria-label="시간표 그리드"
          className={`relative h-full shrink-0 overflow-hidden rounded-[6px] border-[1.5px] border-black-800 bg-black-850 ${interactive ? "touch-none select-none" : ""}`}
          style={{
            width: "87.5%",
            backgroundColor: "#1A1C1F",
            backgroundImage:
              "linear-gradient(to right, transparent calc(100% - 1.5px), #282C2F calc(100% - 1.5px)), linear-gradient(to bottom, transparent calc(100% - 1.5px), #282C2F calc(100% - 1.5px))",
            backgroundSize: `${100 / DAYS.length}% 100%, 100% ${100 / hours.length}%`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={() => setDragSelection(null)}
        >
          {[...backgroundEntries, ...visibleEntries].map((entry, index) => {
            const selectedSlotCount = entry.endSlot - entry.startSlot + 1;

            return (
              <div
                key={`${entry.dayIndex}-${entry.startSlot}-${entry.endSlot}-${index}`}
                role={!interactive && onEntryClick ? "button" : undefined}
                tabIndex={!interactive && onEntryClick ? 0 : undefined}
                aria-label={!interactive && entry.title ? `${entry.title} 상세 보기` : undefined}
                className={`absolute transition-[top,height] duration-75 ${interactive ? "pointer-events-none" : "cursor-pointer"}`}
                onClick={() => !interactive && onEntryClick?.(index)}
                onKeyDown={(event) => {
                  if (!interactive && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onEntryClick?.(index);
                  }
                }}
                style={{
                  backgroundColor: entry.color ?? "#32DE56",
                  left: `${(entry.dayIndex / DAYS.length) * 100}%`,
                  top: `${(entry.startSlot / timeSlotCount) * 100}%`,
                  width: `${100 / DAYS.length}%`,
                  height: `${(selectedSlotCount / timeSlotCount) * 100}%`,
                }}
              />
            );
          })}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, transparent calc(100% - 1.5px), #282C2F calc(100% - 1.5px)), linear-gradient(to bottom, transparent calc(100% - 1.5px), #282C2F calc(100% - 1.5px))",
              backgroundSize: `${100 / DAYS.length}% 100%, 100% ${100 / hours.length}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

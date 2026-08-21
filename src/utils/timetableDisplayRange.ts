import type { TimeTableEntry } from "@/store/useTimeTableStore";

type TimetableRange = Pick<TimeTableEntry, "endSlot">;

export function calculateTimetableEndHour(
  entries: TimetableRange[],
  startHour: number,
) {
  if (entries.length === 0) {
    return Math.min(24, startHour + 1);
  }

  const latestEndMinutes = Math.max(
    ...entries.map(
      (entry) => startHour * 60 + (entry.endSlot + 1) * 5,
    ),
  );

  return Math.min(
    24,
    Math.max(startHour + 1, Math.ceil(latestEndMinutes / 60)),
  );
}

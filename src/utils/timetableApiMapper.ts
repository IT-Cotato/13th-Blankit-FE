import type { TimeTableEntry } from "@/store/useTimeTableStore";
import type { TimetableRequest, TimetableResponse } from "@/types/timetableApi";

const SLOT_MINUTES = 5;

function parseMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number): string {
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export function mapTimetableResponse(
  item: TimetableResponse,
  startHour: number,
): TimeTableEntry {
  const baseMinutes = startHour * 60;
  return {
    id: String(item.timetableId),
    scheduleId: String(item.timetableId),
    title: item.title,
    place: item.place ?? "",
    color: item.color,
    dayIndex: item.dayOfWeek,
    startSlot: Math.max(0, (parseMinutes(item.startTime) - baseMinutes) / SLOT_MINUTES),
    endSlot: Math.max(0, (parseMinutes(item.endTime) - baseMinutes) / SLOT_MINUTES - 1),
  };
}

export function mapTimetableRequest(
  entry: Omit<TimeTableEntry, "id">,
  startHour: number,
): TimetableRequest {
  const baseMinutes = startHour * 60;
  return {
    dayOfWeek: entry.dayIndex,
    startTime: formatTime(baseMinutes + entry.startSlot * SLOT_MINUTES),
    endTime: formatTime(baseMinutes + (entry.endSlot + 1) * SLOT_MINUTES),
    title: entry.title?.trim() || "일정",
    place: entry.place?.trim() || undefined,
    color: entry.color ?? "#5BE478",
  };
}

export function formatTimetableSettingHour(hour: number): string {
  return `${String(hour === 24 ? 0 : hour).padStart(2, "0")}:00:00`;
}

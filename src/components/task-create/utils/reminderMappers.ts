import type { AlarmOption } from "@/components/task-create/alarm/alarmOptions";
import type { ReminderOffsetMinutes } from "@/types/taskApi";

export const ALARM_MINUTES_MAP: Partial<
  Record<AlarmOption, ReminderOffsetMinutes>
> = {
  "1일 전": 1440,
  "3일 전": 4320,
  "일주일 전": 10080,
};

const REMINDER_ALARM_MAP: Record<
  ReminderOffsetMinutes,
  AlarmOption
> = {
  1440: "1일 전",
  4320: "3일 전",
  10080: "일주일 전",
};

export function reminderOffsetToAlarmOption(
  minutes: ReminderOffsetMinutes,
): AlarmOption {
  return REMINDER_ALARM_MAP[minutes];
}

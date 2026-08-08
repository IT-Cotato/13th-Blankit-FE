export const ALARM_OPTIONS = [
  "1일 전",
  "3일 전",
  "일주일 전",
] as const;

export type AlarmOption = (typeof ALARM_OPTIONS)[number];

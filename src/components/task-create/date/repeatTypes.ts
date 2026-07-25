export const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6] as const;
export const MONTH_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export const DAY_OF_MONTH_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
] as const;

export type Weekday = (typeof WEEKDAY_VALUES)[number];
export type Month = (typeof MONTH_VALUES)[number];
export type DayOfMonth = (typeof DAY_OF_MONTH_VALUES)[number];
export type RepeatDay = DayOfMonth | "last";

export type RepeatPattern =
  | {
      type: "weekly";
      weekdays: Weekday[];
    }
  | {
      type: "monthly";
      days: RepeatDay[];
    }
  | {
      type: "yearly";
      month: Month | null;
      days: RepeatDay[];
    };

export interface RepeatSettingsDraft {
  startDate: Date | null;
  endDate: Date | null;
  pattern: RepeatPattern;
}

export interface RepeatSettings {
  startDate: Date;
  endDate: Date;
  pattern: RepeatPattern;
}

export function createInitialRepeatDraft(): RepeatSettingsDraft {
  return {
    startDate: null,
    endDate: null,
    pattern: {
      type: "weekly",
      weekdays: [],
    },
  };
}

export function isRepeatSettingsComplete(
  settings: RepeatSettingsDraft,
): boolean {
  if (
    !settings.startDate ||
    !settings.endDate ||
    settings.endDate < settings.startDate
  ) {
    return false;
  }

  switch (settings.pattern.type) {
    case "weekly":
      return settings.pattern.weekdays.length > 0;
    case "monthly":
      return settings.pattern.days.length > 0;
    case "yearly":
      return (
        settings.pattern.month !== null &&
        settings.pattern.days.length > 0
      );
  }
}

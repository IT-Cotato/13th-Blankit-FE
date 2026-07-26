import type {
  RepeatDay,
  RepeatPattern,
  RepeatSettings,
  RepeatSettingsDraft,
} from "../repeatTypes";

const OPEN_ENDED_SEARCH_YEARS = 2;

function isLastDayOfMonth(date: Date) {
  return (
    date.getDate() ===
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  );
}

function matchesDay(date: Date, days: RepeatDay[]) {
  return (
    days.some((day) => day === date.getDate()) ||
    (days.includes("last") && isLastDayOfMonth(date))
  );
}

function matchesPattern(date: Date, pattern: RepeatPattern) {
  switch (pattern.type) {
    case "weekly":
      return pattern.weekdays.some((weekday) => weekday === date.getDay());
    case "monthly":
      return matchesDay(date, pattern.days);
    case "yearly":
      return (
        pattern.month !== null &&
        date.getMonth() === pattern.month &&
        matchesDay(date, pattern.days)
      );
  }
}

export function createRepeatPattern(
  type: RepeatPattern["type"],
): RepeatPattern {
  switch (type) {
    case "weekly":
      return { type, weekdays: [] };
    case "monthly":
      return { type, days: [] };
    case "yearly":
      return { type, month: null, days: [] };
  }
}

export function cloneRepeatPattern(pattern: RepeatPattern): RepeatPattern {
  switch (pattern.type) {
    case "weekly":
      return { ...pattern, weekdays: [...pattern.weekdays] };
    case "monthly":
      return { ...pattern, days: [...pattern.days] };
    case "yearly":
      return { ...pattern, days: [...pattern.days] };
  }
}

export function createInitialRepeatDraft(): RepeatSettingsDraft {
  return {
    startDate: null,
    endDate: null,
    pattern: createRepeatPattern("weekly"),
  };
}

export function createRepeatDraft(
  initialRepeat: RepeatSettings | null,
): RepeatSettingsDraft {
  if (!initialRepeat) {
    return createInitialRepeatDraft();
  }

  return {
    startDate: initialRepeat.startDate,
    endDate: initialRepeat.endDate,
    pattern: cloneRepeatPattern(initialRepeat.pattern),
  };
}

export function isRepeatSettingsComplete(
  settings: RepeatSettingsDraft,
): boolean {
  if (
    !settings.startDate ||
    (settings.endDate !== null && settings.endDate < settings.startDate)
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

export function getFirstRepeatDate(settings: RepeatSettings): Date | null {
  const currentDate = new Date(
    settings.startDate.getFullYear(),
    settings.startDate.getMonth(),
    settings.startDate.getDate(),
  );
  const endDate = settings.endDate
    ? new Date(
        settings.endDate.getFullYear(),
        settings.endDate.getMonth(),
        settings.endDate.getDate(),
      )
    : new Date(
        settings.startDate.getFullYear() + OPEN_ENDED_SEARCH_YEARS,
        settings.startDate.getMonth(),
        settings.startDate.getDate(),
      );

  while (currentDate <= endDate) {
    if (matchesPattern(currentDate, settings.pattern)) {
      return new Date(currentDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null;
}

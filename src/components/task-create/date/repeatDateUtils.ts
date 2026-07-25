import type {
  RepeatDay,
  RepeatPattern,
  RepeatSettings,
} from "./repeatTypes";

function isLastDayOfMonth(date: Date) {
  return date.getDate() === new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
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
      return pattern.weekdays.some(
        (weekday) => weekday === date.getDay(),
      );
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

export function getFirstRepeatDate(
  settings: RepeatSettings,
): Date | null {
  const currentDate = new Date(
    settings.startDate.getFullYear(),
    settings.startDate.getMonth(),
    settings.startDate.getDate(),
  );
  const endDate = new Date(
    settings.endDate.getFullYear(),
    settings.endDate.getMonth(),
    settings.endDate.getDate(),
  );

  while (currentDate <= endDate) {
    if (matchesPattern(currentDate, settings.pattern)) {
      return new Date(currentDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null;
}

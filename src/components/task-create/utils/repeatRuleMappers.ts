import { formatDateKey } from "@/components/task-create/date/utils/calendar";
import type {
  DayOfMonth,
  MonthIndex,
  RepeatDay,
  RepeatSettings,
  Weekday,
} from "@/components/task-create/date/repeatTypes";
import {
  DAY_OF_MONTH_VALUES,
  MONTH_VALUES,
  WEEKDAY_VALUES,
} from "@/components/task-create/date/repeatTypes";
import type {
  RepeatRuleRequest,
  RepeatRuleResponse,
} from "@/types/taskApi";

function isDayOfMonth(
  day: RepeatDay,
): day is DayOfMonth {
  return day !== "last";
}

function isWeekday(
  value: number,
): value is Weekday {
  return WEEKDAY_VALUES.includes(value as Weekday);
}

function isValidDayOfMonth(
  value: number,
): value is DayOfMonth {
  return DAY_OF_MONTH_VALUES.includes(value as DayOfMonth);
}

function isMonthIndex(
  value: number,
): value is MonthIndex {
  return MONTH_VALUES.includes(value as MonthIndex);
}

function parseDateKey(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function repeatRuleResponseToSettings(
  repeatRule: RepeatRuleResponse,
): RepeatSettings {
  const startDate = parseDateKey(repeatRule.startDate);
  const endDate = repeatRule.endDate
    ? parseDateKey(repeatRule.endDate)
    : null;

  switch (repeatRule.frequency) {
    case "WEEKLY":
      return {
        startDate,
        endDate,
        pattern: {
          type: "weekly",
          weekdays: repeatRule.daysOfWeek.filter(isWeekday),
        },
      };

    case "MONTHLY": {
      const days: RepeatDay[] =
        repeatRule.daysOfMonth.filter(isValidDayOfMonth);

      if (repeatRule.lastDayOfMonth) {
        days.push("last");
      }

      return {
        startDate,
        endDate,
        pattern: { type: "monthly", days },
      };
    }

    case "YEARLY": {
      const monthIndex =
        repeatRule.monthOfYear === null
          ? null
          : repeatRule.monthOfYear - 1;
      const days: RepeatDay[] =
        repeatRule.daysOfMonth.filter(isValidDayOfMonth);

      if (repeatRule.lastDayOfMonth) {
        days.push("last");
      }

      return {
        startDate,
        endDate,
        pattern: {
          type: "yearly",
          month:
            monthIndex !== null && isMonthIndex(monthIndex)
              ? monthIndex
              : null,
          days,
        },
      };
    }
  }
}

export function createRepeatRuleRequest(
  settings: RepeatSettings,
): RepeatRuleRequest {
  const commonValues = {
    startDate: formatDateKey(settings.startDate),
    endDate: settings.endDate
      ? formatDateKey(settings.endDate)
      : null,
  };

  switch (settings.pattern.type) {
    case "weekly":
      return {
        frequency: "WEEKLY",
        daysOfWeek: settings.pattern.weekdays,
        ...commonValues,
      };

    case "monthly":
      return {
        frequency: "MONTHLY",
        daysOfMonth: settings.pattern.days.filter(isDayOfMonth),
        lastDayOfMonth: settings.pattern.days.includes("last"),
        ...commonValues,
      };

    case "yearly": {
      if (settings.pattern.month === null) {
        throw new Error("연 반복의 월을 선택해주세요.");
      }

      return {
        frequency: "YEARLY",
        monthOfYear: settings.pattern.month + 1,
        daysOfMonth: settings.pattern.days.filter(isDayOfMonth),
        lastDayOfMonth: settings.pattern.days.includes("last"),
        ...commonValues,
      };
    }
  }
}

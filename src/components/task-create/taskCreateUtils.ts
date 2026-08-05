import { formatDateKey } from "./date/utils/calendar";
import { getFirstRepeatDate } from "./date/utils/repeat";

import type { AlarmOption } from "./alarm/alarmOptions";
import type { DayOfMonth, RepeatDay, RepeatSettings } from "./date/repeatTypes";
import type { ReminderOffsetMinutes, RepeatRuleRequest, TaskCreateRequest } from "@/types/taskApi";

interface ResolveTaskDeadlineOptions {
  selectedDate: Date | null;
  repeatSettings: RepeatSettings | null;
  fallbackDeadline: string;
}

export function resolveTaskDeadline({
  selectedDate,
  repeatSettings,
  fallbackDeadline,
}: ResolveTaskDeadlineOptions) {
  const deadlineDate =
    selectedDate ??
    (repeatSettings
      ? getFirstRepeatDate(repeatSettings)
      : null);

  return deadlineDate
    ? formatDateKey(deadlineDate)
    : fallbackDeadline;
}

const ALARM_MINUTES_MAP: Partial<
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

function isDayOfMonth(
  day: RepeatDay,
): day is DayOfMonth {
  return day !== "last";
}

interface CreateTaskRequestParams {
  title: string;
  selectedDate: Date | null;
  repeatSettings: RepeatSettings | null;
  categoryId: number;
  alarm: AlarmOption;
  similarTaskId: number | null;
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
        daysOfMonth:
          settings.pattern.days.filter(
            isDayOfMonth,
          ),
        lastDayOfMonth:
          settings.pattern.days.includes("last"),
        ...commonValues,
      };

    case "yearly": {
      if (settings.pattern.month === null) {
        throw new Error(
          "연 반복의 월을 선택해주세요.",
        );
      }

      return {
        frequency: "YEARLY",
        monthOfYear:
          settings.pattern.month + 1,
        daysOfMonth:
          settings.pattern.days.filter(
            isDayOfMonth,
          ),
        lastDayOfMonth:
          settings.pattern.days.includes("last"),
        ...commonValues,
      };
    }
  }
}

export function createTaskRequest({
  title,
  selectedDate,
  repeatSettings,
  categoryId,
  alarm,
  similarTaskId,
}: CreateTaskRequestParams): TaskCreateRequest {
  const notifyBefore = ALARM_MINUTES_MAP[alarm];

  if (notifyBefore === undefined) {
    throw new Error(
      `${alarm} 알림은 현재 서버에서 지원하지 않습니다.`,
    );
  }

  if (!selectedDate && !repeatSettings) {
    throw new Error(
      "과업 날짜 또는 반복 설정이 필요합니다.",
    );
  }

  return {
    title: title.trim(),
    categoryId,
    notifyBefore,
    notificationEnabled: true,
    estimatedTime: null,
    similarTaskId,
    ...(repeatSettings
      ? {
          repeatRule:
            createRepeatRuleRequest(repeatSettings),
        }
      : {
          deadline: formatDateKey(selectedDate as Date),
        }),
  };
}
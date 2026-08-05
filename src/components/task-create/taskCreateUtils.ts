import { formatDateKey } from "./date/utils/calendar";
import { getFirstRepeatDate } from "./date/utils/repeat";

import type { AlarmOption } from "./alarm/alarmOptions";
import type { RepeatSettings } from "./date/repeatTypes";
import type {
  ReminderOffsetMinutes,
  TaskCreateRequest,
} from "@/types/taskApi";

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

interface CreateNormalTaskRequestParams {
  title: string;
  selectedDate: Date;
  categoryId: number;
  alarm: AlarmOption;
  similarTaskId: number | null;
}

export function createNormalTaskRequest({
  title,
  selectedDate,
  categoryId,
  alarm,
  similarTaskId,
}: CreateNormalTaskRequestParams): TaskCreateRequest {
  const notifyBefore = ALARM_MINUTES_MAP[alarm];

  if (notifyBefore === undefined) {
    throw new Error(
      `${alarm} 알림은 현재 서버에서 지원하지 않습니다.`,
    );
  }

  return {
    title: title.trim(),
    deadline: formatDateKey(selectedDate),
    categoryId,
    notifyBefore,
    notificationEnabled: true,
    estimatedTime: null,
    similarTaskId,
  };
}
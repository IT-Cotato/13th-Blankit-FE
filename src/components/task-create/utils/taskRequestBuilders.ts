import type { AlarmOption } from "@/components/task-create/alarm/alarmOptions";
import type { RepeatSettings } from "@/components/task-create/date/repeatTypes";
import { formatDateKey } from "@/components/task-create/date/utils/calendar";
import type {
  TaskCreateRequest,
  TaskUpdateRequest,
} from "@/types/taskApi";

import { ALARM_MINUTES_MAP } from "./reminderMappers";
import { createRepeatRuleRequest } from "./repeatRuleMappers";

interface TaskRequestParams {
  title: string;
  selectedDate: Date | null;
  repeatSettings: RepeatSettings | null;
  categoryId: number;
  alarm: AlarmOption;
  similarTaskId: number | null;
}

function getNotifyBefore(alarm: AlarmOption) {
  const notifyBefore = ALARM_MINUTES_MAP[alarm];

  if (notifyBefore === undefined) {
    throw new Error(
      `${alarm} 알림은 현재 서버에서 지원하지 않습니다.`,
    );
  }

  return notifyBefore;
}

function requireTaskSchedule(
  selectedDate: Date | null,
  repeatSettings: RepeatSettings | null,
) {
  if (!selectedDate && !repeatSettings) {
    throw new Error("과업 날짜 또는 반복 설정이 필요합니다.");
  }
}

export function createTaskRequest({
  title,
  selectedDate,
  repeatSettings,
  categoryId,
  alarm,
  similarTaskId,
}: TaskRequestParams): TaskCreateRequest {
  const notifyBefore = getNotifyBefore(alarm);
  requireTaskSchedule(selectedDate, repeatSettings);

  return {
    title: title.trim(),
    categoryId,
    notifyBefore,
    notificationEnabled: true,
    estimatedTime: null,
    similarTaskId,
    ...(repeatSettings
      ? { repeatRule: createRepeatRuleRequest(repeatSettings) }
      : { deadline: formatDateKey(selectedDate as Date) }),
  };
}

export function createTaskUpdateRequest({
  title,
  selectedDate,
  repeatSettings,
  categoryId,
  alarm,
  similarTaskId,
}: TaskRequestParams): TaskUpdateRequest {
  const notifyBefore = getNotifyBefore(alarm);
  requireTaskSchedule(selectedDate, repeatSettings);

  return {
    title: title.trim(),
    categoryId,
    notifyBefore,
    notificationEnabled: true,
    similarTaskId,
    clearSimilarTask: similarTaskId === null,
    ...(repeatSettings
      ? {
          repeatRule: createRepeatRuleRequest(repeatSettings),
          clearRepeatRule: false,
        }
      : {
          deadline: formatDateKey(selectedDate as Date),
          clearRepeatRule: true,
        }),
  };
}

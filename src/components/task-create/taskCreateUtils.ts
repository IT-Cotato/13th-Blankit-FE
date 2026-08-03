import { formatDateKey } from "./date/utils/calendar";
import { getFirstRepeatDate } from "./date/utils/repeat";

import type { RepeatSettings } from "./date/repeatTypes";

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
    (repeatSettings ? getFirstRepeatDate(repeatSettings) : null);

  return deadlineDate ? formatDateKey(deadlineDate) : fallbackDeadline;
}

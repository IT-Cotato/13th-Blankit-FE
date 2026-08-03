import { useState } from "react";

import type { RepeatSettings } from "./repeatTypes";

interface UseDateFlowOptions {
  onReturnToComposer?: () => void;
  initialDate?: Date | null;
}

export function useDateFlow({
  onReturnToComposer,
  initialDate = null,
}: UseDateFlowOptions = {}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(initialDate);
  const [repeatSettings, setRepeatSettings] =
    useState<RepeatSettings | null>(null);

  function openDateSheet() {
    setOpen(true);
  }

  function closeDateSheet() {
    setOpen(false);
    onReturnToComposer?.();
  }

  function confirmDate(date: Date) {
    setSelectedDate(date);
    setRepeatSettings(null);
    setOpen(false);
    onReturnToComposer?.();
  }

  function confirmRepeat(settings: RepeatSettings) {
    setRepeatSettings(settings);
    setSelectedDate(null);
    setOpen(false);
    onReturnToComposer?.();
  }

  return {
    open,
    selectedDate,
    repeatSettings,
    openDateSheet,
    closeDateSheet,
    confirmDate,
    confirmRepeat,
  };
}

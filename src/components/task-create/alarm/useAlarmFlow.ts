import { useState } from "react";

import type { AlarmOption } from "./alarmOptions";

export type AlarmFlowView = "composer" | "alarm-list";

interface UseAlarmFlowOptions {
  onReturnToComposer?: () => void;
  initialAlarm?: AlarmOption;
}

export function useAlarmFlow({
  onReturnToComposer,
  initialAlarm = "1일 전",
}: UseAlarmFlowOptions = {}) {
  const [view, setView] = useState<AlarmFlowView>("composer");
  const [selectedAlarm, setSelectedAlarm] =
    useState<AlarmOption>(initialAlarm);

  function openAlarms() {
    setView("alarm-list");
  }

  function selectAlarm(alarm: AlarmOption) {
    setSelectedAlarm(alarm);
    setView("composer");
    onReturnToComposer?.();
  }

  return {
    view,
    selectedAlarm,
    openAlarms,
    selectAlarm,
  };
}

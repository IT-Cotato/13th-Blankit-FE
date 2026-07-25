import { useState } from "react";

import type { AlarmOption } from "./alarmOptions";

export type AlarmFlowView = "composer" | "alarm-list";

interface UseAlarmFlowOptions {
  onReturnToComposer?: () => void;
}

export function useAlarmFlow({
  onReturnToComposer,
}: UseAlarmFlowOptions = {}) {
  const [view, setView] = useState<AlarmFlowView>("composer");
  const [selectedAlarm, setSelectedAlarm] =
    useState<AlarmOption>("1시간 전");

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

import { useState } from "react";

interface UseDateFlowOptions {
  onReturnToComposer?: () => void;
}

export function useDateFlow({
  onReturnToComposer,
}: UseDateFlowOptions = {}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  function openDateSheet() {
    setOpen(true);
  }

  function closeDateSheet() {
    setOpen(false);
    onReturnToComposer?.();
  }

  function confirmDate(date: Date) {
    setSelectedDate(date);
    setOpen(false);
    onReturnToComposer?.();
  }

  return {
    open,
    selectedDate,
    openDateSheet,
    closeDateSheet,
    confirmDate,
  };
}

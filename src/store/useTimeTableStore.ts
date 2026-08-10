import { create } from "zustand";

export type TimeTableEntry = {
  id: string;
  scheduleId?: string;
  title?: string;
  place?: string;
  color?: string;
  dayIndex: number;
  startSlot: number;
  endSlot: number;
};

type TimeTableState = {
  entries: TimeTableEntry[];
  startHour: number;
  endHour: number;
  setStartHour: (hour: number) => void;
  setEndHour: (hour: number) => void;
  setEntries: (entries: TimeTableEntry[]) => void;
  addEntries: (entries: TimeTableEntry[]) => void;
  replaceSchedule: (scheduleId: string, entries: TimeTableEntry[]) => void;
  removeSchedule: (scheduleId: string) => void;
  resetTimeTable: () => void;
};

export const useTimeTableStore = create<TimeTableState>((set) => ({
  entries: [],
  startHour: 8,
  endHour: 24,
  setStartHour: (hour) =>
    set((state) => ({
      startHour: hour,
      endHour: hour >= state.endHour ? Math.min(24, hour + 1) : state.endHour,
    })),
  setEndHour: (hour) =>
    set((state) => ({
      startHour: hour <= state.startHour ? Math.max(0, hour - 1) : state.startHour,
      endHour: hour,
    })),
  setEntries: (entries) => set({ entries }),
  addEntries: (entries) =>
    set((state) => ({ entries: [...state.entries, ...entries] })),
  replaceSchedule: (scheduleId, entries) =>
    set((state) => ({
      entries: [
        ...state.entries.filter(
          (entry) => (entry.scheduleId ?? entry.id) !== scheduleId,
        ),
        ...entries,
      ],
    })),
  removeSchedule: (scheduleId) =>
    set((state) => ({
      entries: state.entries.filter(
        (entry) => (entry.scheduleId ?? entry.id) !== scheduleId,
      ),
    })),
  resetTimeTable: () => set({ entries: [], startHour: 8, endHour: 24 }),
}));

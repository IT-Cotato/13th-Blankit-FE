import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimeTableEntry = {
  id: string;
  scheduleId?: string;
  title?: string;
  place?: string;
  color?: string;
  dayIndex: number;
  startSlot: number;
  endSlot: number;
  isLocalFallback?: boolean;
};

type TimeTableState = {
  entries: TimeTableEntry[];
  startHour: number;
  endHour: number;
  setStartHour: (hour: number) => void;
  setEndHour: (hour: number) => void;
  applyTimeRange: (startHour: number, endHour: number) => void;
  replaceTimetable: (
    entries: TimeTableEntry[],
    startHour: number,
    endHour: number,
  ) => void;
  setEntries: (entries: TimeTableEntry[]) => void;
  addEntries: (entries: TimeTableEntry[]) => void;
  replaceSchedule: (scheduleId: string, entries: TimeTableEntry[]) => void;
  removeSchedule: (scheduleId: string) => void;
  resetTimeTable: () => void;
};

export const useTimeTableStore = create<TimeTableState>()(
  persist(
    (set) => ({
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
      applyTimeRange: (startHour, endHour) =>
        set((state) => {
          const slotOffset = (state.startHour - startHour) * 12;
          return {
            startHour,
            endHour,
            entries: state.entries.map((entry) => ({
              ...entry,
              startSlot: entry.startSlot + slotOffset,
              endSlot: entry.endSlot + slotOffset,
            })),
          };
        }),
      replaceTimetable: (entries, startHour, endHour) =>
        set({ entries, startHour, endHour }),
      setEntries: (entries) =>
        set((state) => ({
          entries: [
            ...entries,
            ...state.entries.filter((entry) => entry.isLocalFallback),
          ],
        })),
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
    }),
    {
      name: "timetable-storage",
      partialize: (state) => ({
        entries: state.entries,
        startHour: state.startHour,
        endHour: state.endHour,
      }),
    },
  ),
);

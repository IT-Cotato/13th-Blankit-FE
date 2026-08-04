import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { TimeTableDeleteModal } from "@/components/mypage/TimeTableDeleteModal";
import { TimeTableDetailSheet } from "@/components/mypage/TimeTableDetailSheet";
import { TimeTableEntrySheet } from "@/components/mypage/TimeTableEntrySheet";
import { WeeklyTimeTable } from "@/components/mypage/WeeklyTimeTable";
import { useTimeTableStore, type TimeTableEntry } from "@/store/useTimeTableStore";

type ActionIconProps = {
  src: string;
};

function ActionIcon({ src }: ActionIconProps) {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 shrink-0 items-center justify-center px-[3px] py-0.5"
    >
      <img src={src} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export function TimeTable() {
  const navigate = useNavigate();
  const entries = useTimeTableStore((state) => state.entries);
  const startHour = useTimeTableStore((state) => state.startHour);
  const removeSchedule = useTimeTableStore((state) => state.removeSchedule);
  const replaceSchedule = useTimeTableStore((state) => state.replaceSchedule);
  const [selectedEntry, setSelectedEntry] = useState<TimeTableEntry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editEntries, setEditEntries] = useState<
    Omit<TimeTableEntry, "id">[]
  >([]);
  const selectedScheduleId = selectedEntry
    ? (selectedEntry.scheduleId ?? selectedEntry.id)
    : null;
  const selectedEntries = selectedScheduleId
    ? entries.filter((entry) => (entry.scheduleId ?? entry.id) === selectedScheduleId)
    : [];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="내 시간표 설정"
        onBack={() => navigate("/mypage")}
        actions={
          <>
            <TopBarIconButton
              aria-label="시간표 추가"
              className="h-8 w-8 p-1"
              onClick={() => navigate("/mypage/timetable/new")}
            >
              <ActionIcon src="/mypage/plus.svg" />
            </TopBarIconButton>
            <TopBarIconButton
              aria-label="설정"
              className="h-8 w-8 p-1"
              onClick={() => navigate("/mypage/timetable/settings")}
            >
              <ActionIcon src="/mypage/setting.svg" />
            </TopBarIconButton>
          </>
        }
      />

      <main className="flex min-h-0 flex-1 px-5 pb-[50px]">
        <WeeklyTimeTable
          entries={entries}
          onEntryClick={(entryIndex) => setSelectedEntry(entries[entryIndex] ?? null)}
        />
      </main>

      {selectedEntry && (
        <TimeTableDetailSheet
          entries={selectedEntries}
          startHour={startHour}
          onClose={() => setSelectedEntry(null)}
          onEdit={() => {
            setEditEntries(
              selectedEntries.map((entry) => ({
                scheduleId: entry.scheduleId,
                title: entry.title,
                place: entry.place,
                color: entry.color,
                dayIndex: entry.dayIndex,
                startSlot: entry.startSlot,
                endSlot: entry.endSlot,
              })),
            );
            setIsEditSheetOpen(true);
          }}
          onDelete={() => setIsDeleteModalOpen(true)}
        />
      )}

      {isDeleteModalOpen && (
        <TimeTableDeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            if (selectedScheduleId) removeSchedule(selectedScheduleId);
            setIsDeleteModalOpen(false);
            setSelectedEntry(null);
          }}
        />
      )}

      {isEditSheetOpen && selectedEntry && selectedScheduleId && (
        <TimeTableEntrySheet
          entries={editEntries}
          onEntriesChange={setEditEntries}
          initialDetails={{
            title: selectedEntry.title ?? "",
            place: selectedEntry.place ?? "",
            color: selectedEntry.color ?? "#5BE478",
          }}
          onClose={() => setIsEditSheetOpen(false)}
          onComplete={(details) => {
            replaceSchedule(
              selectedScheduleId,
              editEntries.map((entry, index) => ({
                ...entry,
                ...details,
                scheduleId: selectedScheduleId,
                id: `${selectedScheduleId}-${index}`,
              })),
            );
            setIsEditSheetOpen(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}

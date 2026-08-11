import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { TimeTableDeleteModal } from "@/components/mypage/timetable/TimeTableDeleteModal";
import { TimeTableDetailSheet } from "@/components/mypage/timetable/TimeTableDetailSheet";
import { TimeTableEntrySheet } from "@/components/mypage/timetable/TimeTableEntrySheet";
import { WeeklyTimeTable } from "@/components/mypage/timetable/WeeklyTimeTable";
import { useTimeTableStore, type TimeTableEntry } from "@/store/useTimeTableStore";
import {
  deleteTimetableEntry,
  getTimetable,
  updateTimetableEntry,
} from "@/api/mypage/timetable";
import {
  mapTimetableRequest,
  mapTimetableResponse,
} from "@/utils/timetableApiMapper";

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
  const setEntries = useTimeTableStore((state) => state.setEntries);
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

  useEffect(() => {
    let cancelled = false;

    const loadTimetable = async () => {
      try {
        const timetable = await getTimetable();
        if (!cancelled) {
          setEntries(timetable.map((item) => mapTimetableResponse(item, startHour)));
        }
      } catch (error) {
        console.error("시간표를 불러오지 못해 기존 데이터를 표시합니다.", error);
      }
    };

    void loadTimetable();
    return () => {
      cancelled = true;
    };
  }, [setEntries, startHour]);

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
                isLocalFallback: entry.isLocalFallback,
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
          onConfirm={async () => {
            if (selectedScheduleId) {
              try {
                await deleteTimetableEntry(Number(selectedScheduleId));
              } catch (error) {
                console.error("시간표 삭제 API 호출에 실패했습니다.", error);
              }
              removeSchedule(selectedScheduleId);
            }
            setIsDeleteModalOpen(false);
            setSelectedEntry(null);
          }}
        />
      )}

      {isEditSheetOpen && selectedEntry && selectedScheduleId && (
        <TimeTableEntrySheet
          entries={editEntries}
          conflictEntries={entries.filter(
            (entry) => (entry.scheduleId ?? entry.id) !== selectedScheduleId,
          )}
          onEntriesChange={setEditEntries}
          initialDetails={{
            title: selectedEntry.title ?? "",
            place: selectedEntry.place ?? "",
            color: selectedEntry.color ?? "#5BE478",
          }}
          onClose={() => setIsEditSheetOpen(false)}
          onComplete={async (details) => {
            const nextEntries = editEntries.map((entry, index) => ({
                ...entry,
                ...details,
                scheduleId: selectedScheduleId,
                id: `${selectedScheduleId}-${index}`,
              }));
            try {
              const updated = await updateTimetableEntry(
                Number(selectedScheduleId),
                mapTimetableRequest(nextEntries[0], startHour),
              );
              replaceSchedule(selectedScheduleId, [mapTimetableResponse(updated, startHour)]);
            } catch (error) {
              console.error("시간표 수정 API 호출에 실패했습니다.", error);
              replaceSchedule(selectedScheduleId, nextEntries);
            }
            setIsEditSheetOpen(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}

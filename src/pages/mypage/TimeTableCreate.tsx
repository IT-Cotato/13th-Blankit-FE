import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TimeTableCreateTopBar } from "@/components/mypage/timetable/TimeTableCreateTopBar";
import { TimeTableEntrySheet } from "@/components/mypage/timetable/TimeTableEntrySheet";
import { WeeklyTimeTable } from "@/components/mypage/timetable/WeeklyTimeTable";
import {
  useTimeTableStore,
  type TimeTableEntry,
} from "@/store/useTimeTableStore";
import { createTimetableEntries } from "@/api/mypage/timetable";
import {
  mapTimetableRequest,
  mapTimetableResponse,
} from "@/utils/timetableApiMapper";

type DraftEntry = Omit<TimeTableEntry, "id">;

export function TimeTableCreate() {
  const navigate = useNavigate();
  const addEntries = useTimeTableStore((state) => state.addEntries);
  const savedEntries = useTimeTableStore((state) => state.entries);
  const startHour = useTimeTableStore((state) => state.startHour);
  const [draftEntries, setDraftEntries] = useState<DraftEntry[]>([]);
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);

  const handleComplete = async (details: {
    title: string;
    place: string;
    color: string;
  }) => {
    const localEntries = draftEntries.map((entry, index) => {
      const scheduleId = `${Date.now()}-${index}`;
      return {
        ...entry,
        ...details,
        scheduleId,
        id: scheduleId,
        isLocalFallback: true,
      };
    });

    try {
      const createdEntries = await createTimetableEntries(
        localEntries.map((entry) => mapTimetableRequest(entry, startHour)),
      );
      addEntries(
        createdEntries.map((entry) => mapTimetableResponse(entry, startHour)),
      );
    } catch (error) {
      console.error(
        "시간표 추가 API 호출에 실패해 로컬 데이터를 표시합니다.",
        error,
      );
      addEntries(localEntries);
    }
    navigate("/mypage/timetable");
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black-900 text-black-100">
      <TimeTableCreateTopBar
        onCancel={() => navigate("/mypage/timetable")}
        onComplete={() => setIsEntrySheetOpen(true)}
        completeDisabled={draftEntries.length === 0}
      />

      <main className="flex min-h-0 flex-1 px-5 pb-[50px]">
        <WeeklyTimeTable
          interactive
          backgroundEntries={savedEntries}
          entries={draftEntries}
          onEntriesChange={setDraftEntries}
        />
      </main>

      {isEntrySheetOpen && (
        <TimeTableEntrySheet
          entries={draftEntries}
          conflictEntries={savedEntries}
          onEntriesChange={setDraftEntries}
          onClose={() => setIsEntrySheetOpen(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

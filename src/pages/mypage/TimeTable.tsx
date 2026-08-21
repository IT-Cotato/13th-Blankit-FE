import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";
import { TimeTableDeleteModal } from "@/components/mypage/timetable/TimeTableDeleteModal";
import { TimeTableDetailSheet } from "@/components/mypage/timetable/TimeTableDetailSheet";
import { TimeTableEntrySheet } from "@/components/mypage/timetable/TimeTableEntrySheet";
import { WeeklyTimeTable } from "@/components/mypage/timetable/WeeklyTimeTable";
import { NotificationPermissionModal } from "@/components/notification/NotificationPermissionModal";
import { useTimeTableStore, type TimeTableEntry } from "@/store/useTimeTableStore";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/api/mypage/notifications";
import {
  deleteTimetableEntry,
  getTimetable,
  updateTimetableEntry,
  updateTimetableSettings,
} from "@/api/mypage/timetable";
import {
  formatTimetableSettingHour,
  mapTimetableRequest,
  mapTimetableResponse,
} from "@/utils/timetableApiMapper";
import { ensurePushSubscription } from "@/utils/pushSubscription";
import { calculateTimetableEndHour } from "@/utils/timetableDisplayRange";

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

function normalizeSubjectTitle(title?: string): string {
  return (title ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("ko-KR");
}

function isSameSubject(first: TimeTableEntry, second: TimeTableEntry): boolean {
  const firstTitle = normalizeSubjectTitle(first.title);
  const secondTitle = normalizeSubjectTitle(second.title);

  return firstTitle.length > 0 && firstTitle === secondTitle;
}

export function TimeTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const entries = useTimeTableStore((state) => state.entries);
  const startHour = useTimeTableStore((state) => state.startHour);
  const endHour = useTimeTableStore((state) => state.endHour);
  const applyTimeRange = useTimeTableStore((state) => state.applyTimeRange);
  const removeSchedule = useTimeTableStore((state) => state.removeSchedule);
  const replaceSchedule = useTimeTableStore((state) => state.replaceSchedule);
  const setEntries = useTimeTableStore((state) => state.setEntries);
  const skipInitialRefreshRef = useRef(
    location.state?.skipInitialTimetableRefresh === true && entries.length > 0,
  );
  const [selectedEntry, setSelectedEntry] = useState<TimeTableEntry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(
    location.state?.showPackPermissionModal === true,
  );
  const [isPackPermissionSubmitting, setIsPackPermissionSubmitting] =
    useState(false);
  const [editEntries, setEditEntries] = useState<
    Omit<TimeTableEntry, "id">[]
  >([]);
  const selectedScheduleId = selectedEntry
    ? (selectedEntry.scheduleId ?? selectedEntry.id)
    : null;
  const selectedSubjectEntries = selectedEntry
    ? entries
        .filter(
          (entry) => isSameSubject(entry, selectedEntry),
        )
        .sort(
          (first, second) =>
            first.dayIndex - second.dayIndex ||
            first.startSlot - second.startSlot,
        )
    : [];

  useEffect(() => {
    if (location.state?.showPackPermissionModal === true) {
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          showPackPermissionModal: false,
        },
      });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (skipInitialRefreshRef.current) {
      skipInitialRefreshRef.current = false;
      return;
    }

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
          entries={selectedSubjectEntries}
          startHour={startHour}
          onClose={() => setSelectedEntry(null)}
          onEdit={() => {
            const subjectEntries = useTimeTableStore
              .getState()
              .entries.filter((entry) => isSameSubject(entry, selectedEntry))
              .sort(
                (first, second) =>
                  first.dayIndex - second.dayIndex ||
                  first.startSlot - second.startSlot,
              );
            setEditEntries(
              subjectEntries.map((entry) => ({
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
              const remainingEntries = entries.filter(
                (entry) =>
                  (entry.scheduleId ?? entry.id) !== selectedScheduleId,
              );

              try {
                await deleteTimetableEntry(Number(selectedScheduleId));
              } catch (error) {
                console.error("시간표 삭제 API 호출에 실패했습니다.", error);
              }
              removeSchedule(selectedScheduleId);

              if (remainingEntries.length > 0) {
                const nextEndHour = calculateTimetableEndHour(
                  remainingEntries,
                  startHour,
                );

                if (nextEndHour !== endHour) {
                  try {
                    await updateTimetableSettings({
                      startTime: formatTimetableSettingHour(startHour),
                      endTime: formatTimetableSettingHour(nextEndHour),
                    });
                  } catch (error) {
                    console.error(
                      "시간표 삭제 후 표시 범위를 변경하지 못했습니다.",
                      error,
                    );
                  }
                  applyTimeRange(startHour, nextEndHour);
                }
              }
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
            (entry) =>
              !new Set(
                selectedSubjectEntries.map(
                  (subjectEntry) => subjectEntry.scheduleId ?? subjectEntry.id,
                ),
              ).has(entry.scheduleId ?? entry.id),
          )}
          onEntriesChange={setEditEntries}
          initialDetails={{
            title: selectedEntry.title ?? "",
            place: selectedEntry.place ?? "",
            color: selectedEntry.color ?? "#5BE478",
          }}
          onClose={() => setIsEditSheetOpen(false)}
          onComplete={async (details) => {
            const nextEntries = editEntries.map((entry, index) => {
              const originalEntry = selectedSubjectEntries[index];
              const scheduleId =
                entry.scheduleId ??
                originalEntry?.scheduleId ??
                originalEntry?.id;

              if (!scheduleId) {
                throw new Error("수정할 시간표 ID를 찾을 수 없습니다.");
              }

              return {
                ...entry,
                ...details,
                scheduleId,
                id: scheduleId,
              };
            });
            const updateResults = await Promise.allSettled(
              nextEntries.map(async (entry) => {
                if (entry.isLocalFallback) return entry;

                const updated = await updateTimetableEntry(
                  Number(entry.scheduleId),
                  mapTimetableRequest(entry, startHour),
                );
                return mapTimetableResponse(updated, startHour);
              }),
            );

            updateResults.forEach((result, index) => {
              const scheduleId = nextEntries[index].scheduleId;

              if (result.status === "fulfilled") {
                replaceSchedule(scheduleId, [result.value]);
              } else {
                console.error("시간표 수정 API 호출에 실패했습니다.", result.reason);
                replaceSchedule(scheduleId, [nextEntries[index]]);
              }
            });
            setIsEditSheetOpen(false);
            setSelectedEntry(null);
          }}
        />
      )}

      <NotificationPermissionModal
        open={isPackModalOpen}
        submitting={isPackPermissionSubmitting}
        title="자투리 시간 PACK!"
        description="알림을 허용하면 자투리 시간에 할 수 있는 과업을 추천해드릴게요."
        onAllow={() => {
          if (isPackPermissionSubmitting) return;

          void (async () => {
            setIsPackPermissionSubmitting(true);

            try {
              const settings = await getNotificationSettings();

              if (!settings.is30minPackAlarmEnabled) {
                await ensurePushSubscription();
                await updateNotificationSettings({
                  ...settings,
                  is30minPackAlarmEnabled: true,
                });
              }

              setIsPackModalOpen(false);
            } catch (error) {
              console.error("30분 Pack 알림을 설정하지 못했습니다.", error);
            } finally {
              setIsPackPermissionSubmitting(false);
            }
          })();
        }}
        onClose={() => {
          if (!isPackPermissionSubmitting) {
            setIsPackModalOpen(false);
          }
        }}
      />
    </div>
  );
}

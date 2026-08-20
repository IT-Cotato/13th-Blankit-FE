import { useEffect, useMemo, useRef, useState } from "react";

import {
    fetchMonthlyCalendarStats,
    fetchDailyFeedback,
} from "@/api/calendar/stats";
import { fetchMonthlyCalendarTasks } from "@/api/calendar/dots";
import { getTasks } from "@/api/tasks";
import type { DailyStat, DailyFeedbackData } from "@/types/calendarStats";
import type { CalendarTaskDot } from "@/types/calendarMonthlyTasks";
import type { TaskListResponse } from "@/types/taskApi";

import {
    CalendarGrid,
    type CalendarDayCell,
    type CalendarDateStatus,
    type CalendarViewMode,
} from "@/components/calendar/CalendarGrid";
import { CalendarTopBar } from "@/components/calendar/CalendarTopBar";
import { CalendarTaskSheet } from "./CalendarTaskSheet";

const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const SWIPE_THRESHOLD_PX = 50;

const getDateStatus = (cellDate: Date, todayDate: Date): CalendarDateStatus => {
    const cellDay = new Date(
        cellDate.getFullYear(),
        cellDate.getMonth(),
        cellDate.getDate(),
    );
    const today = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate(),
    );

    if (cellDay.getTime() === today.getTime()) return "today";
    return cellDay < today ? "past" : "future";
};

const getDaysInMonth = (
    date: Date,
    dailyStatsByDate: Record<string, DailyStat>,
    monthlyTasksByDate: Record<string, CalendarTaskDot[]>,
): CalendarDayCell[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const leadingBlankCount = firstDay.getDay();
    const totalCells = Math.ceil((leadingBlankCount + daysInMonth) / 7) * 7;
    const today = new Date();

    return Array.from({ length: totalCells }, (_, index) => {
        const dayOffset = index - leadingBlankCount + 1;
        const cellDate = new Date(year, month, dayOffset);
        const yyyy = String(cellDate.getFullYear());
        const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
        const dd = String(cellDate.getDate()).padStart(2, "0");
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dailyStat = dailyStatsByDate[dateKey];

        return {
            key: dateKey,
            day: cellDate.getDate(),
            isCurrentMonth: cellDate.getMonth() === month,
            isToday: cellDate.toDateString() === today.toDateString(),
            dateStatus: getDateStatus(cellDate, today),
            // 그리드 점(●) 렌더링 전용 데이터 — GET /api/tasks/calendar 결과
            tasks: monthlyTasksByDate[dateKey] ?? [],
            // 미래 날짜는 API가 actualMinutes: null을 내려줌 → 그리드 렌더링용으로는 0 처리
            actualMinutes: dailyStat?.actualMinutes ?? 0,
            recommendedMinutes: dailyStat?.recommendedMinutes ?? 0,
        };
    });
};

export const CalendarPage = () => {
    const today = new Date();
    const yyyy = String(today.getFullYear());
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const defaultDateKey = `${yyyy}-${mm}-${dd}`;

    const [selectedDate, setSelectedDate] = useState<string | null>(
        defaultDateKey,
    );
    const [viewMode, setViewMode] = useState<CalendarViewMode>("default");

    const [currentMonth, setCurrentMonth] = useState<Date>(
        () => new Date(today.getFullYear(), today.getMonth(), 1),
    );

    // 월별 통계 (날짜별 actualMinutes/recommendedMinutes)
    const [dailyStatsByDate, setDailyStatsByDate] = useState<
        Record<string, DailyStat>
    >({});

    // 월별 과업 (날짜별 그리드 점(●) 렌더링용, GET /api/tasks/calendar)
    const [monthlyTasksByDate, setMonthlyTasksByDate] = useState<
        Record<string, CalendarTaskDot[]>
    >({});

    // 선택한 날짜가 마감일인 과업 목록 (default 모드 바텀시트, GET /api/tasks?date=)
    const [fetchedDateTasksResult, setFetchedDateTasksResult] = useState<{
        date: string;
        tasks: TaskListResponse[];
    } | null>(null);

    // 선택한 날짜의 피드백(완료된 과업 목록 + 소요/권장 시간)
    const [dailyFeedbackResult, setDailyFeedbackResult] = useState<{
        date: string;
        data: DailyFeedbackData;
    } | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const loadMonthlyStats = async () => {
            try {
                const result = await fetchMonthlyCalendarStats(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                );

                if (isCancelled) return;

                // // === 테스트 로그: API 원본 응답 확인 ===
                // console.log("[monthlyStats] raw result:", result);
                // console.log(
                //     "[monthlyStats] date keys from API:",
                //     result.dailyStats.map((s) => s.date),
                // );
                // // === 테스트 ===

                const statsByDate = result.dailyStats.reduce<
                    Record<string, DailyStat>
                >((accumulator, stat) => {
                    accumulator[stat.date] = stat;
                    return accumulator;
                }, {});

                // // === 테스트 ===
                // console.log("[monthlyStats] statsByDate map:", statsByDate);
                // // === 테스트 ===

                // 기존에 로드해둔 다른 달 데이터는 유지하고, 이번 달 데이터만 추가/갱신
                setDailyStatsByDate((prev) => ({ ...prev, ...statsByDate }));
            } catch {
                // 실패 시에도 기존에 로드해둔 데이터는 지우지 않음
                if (!isCancelled) {
                    // 필요하다면 에러 상태만 별도로 관리하고, 여기서 굳이 초기화하지 않음
                }
            }
        };

        loadMonthlyStats();

        return () => {
            isCancelled = true;
        };
    }, [currentMonth]);

    // currentMonth가 바뀔 때마다 월별 과업(그리드 점 렌더링용) 재조회
    useEffect(() => {
        let isCancelled = false;

        const loadMonthlyTasks = async () => {
            try {
                const result = await fetchMonthlyCalendarTasks(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                );

                if (isCancelled) return;

                const tasksByDate = result.reduce<
                    Record<string, CalendarTaskDot[]>
                >((accumulator, monthlyTasks) => {
                    accumulator[monthlyTasks.date] = monthlyTasks.tasks;
                    return accumulator;
                }, {});

                setMonthlyTasksByDate(tasksByDate);
            } catch {
                if (!isCancelled) {
                    setMonthlyTasksByDate({});
                }
            }
        };

        loadMonthlyTasks();

        return () => {
            isCancelled = true;
        };
    }, [currentMonth]);

    // selectedDate가 바뀔 때마다 해당 날짜 마감 과업 목록 재조회 (바텀시트 default 모드)
    useEffect(() => {
        if (!selectedDate) return; // 동기 setState 제거 - 아래 파생값에서 처리

        let isCancelled = false;

        const loadSelectedDateTasks = async () => {
            try {
                const result = await getTasks({ date: selectedDate });

                if (!isCancelled) {
                    setFetchedDateTasksResult({
                        date: selectedDate,
                        tasks: result.content,
                    });
                }
            } catch {
                if (!isCancelled) {
                    setFetchedDateTasksResult({
                        date: selectedDate,
                        tasks: [],
                    });
                }
            }
        };

        loadSelectedDateTasks();

        return () => {
            isCancelled = true;
        };
    }, [selectedDate]);

    // selectedDate가 바뀔 때마다 일별 피드백 재조회
    useEffect(() => {
        if (!selectedDate) return;

        let isCancelled = false;

        const loadDailyFeedback = async () => {
            try {
                const result = await fetchDailyFeedback(selectedDate);

                if (!isCancelled) {
                    setDailyFeedbackResult({
                        date: selectedDate,
                        data: result,
                    });
                }
            } catch {
                if (!isCancelled) {
                    setDailyFeedbackResult(null);
                }
            }
        };

        loadDailyFeedback();

        return () => {
            isCancelled = true;
        };
    }, [selectedDate]);

    const selectedDailyFeedback =
        dailyFeedbackResult && dailyFeedbackResult.date === selectedDate
            ? dailyFeedbackResult.data
            : null;

    // selectedDate와 응답의 date가 일치할 때만 노출, 그 외엔 빈 배열
    // (dailyFeedbackResult와 동일한 패턴 - isCancelled 가드에 더한 이중 안전장치)
    const selectedDateTasks =
        fetchedDateTasksResult && fetchedDateTasksResult.date === selectedDate
            ? fetchedDateTasksResult.tasks
            : [];

    const monthDays = useMemo(
        () =>
            getDaysInMonth(currentMonth, dailyStatsByDate, monthlyTasksByDate),
        [currentMonth, dailyStatsByDate, monthlyTasksByDate],
    );

    // CalendarTaskSheet에는 원본 dailyStat(actualMinutes가 null일 수 있음)을 그대로 전달
    const selectedDailyStat = useMemo(() => {
        if (!selectedDate) return null;
        return dailyStatsByDate[selectedDate] ?? null;
    }, [selectedDate, dailyStatsByDate]);

    const handleSelectDate = (dateKey: string) => {
        setSelectedDate(dateKey);
    };

    const handleToggleViewMode = () => {
        setViewMode((prev) => (prev === "default" ? "stats" : "default"));
    };

    const goToMonth = (offset: 1 | -1) => {
        setCurrentMonth((prev) => {
            const nextMonth = new Date(
                prev.getFullYear(),
                prev.getMonth() + offset,
                1,
            );

            // +1(다음 달)이면 그 달의 1일, -1(이전 달)이면 그 달의 마지막 날을 자동 선택
            const targetDate =
                offset === 1
                    ? new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)
                    : new Date(
                          nextMonth.getFullYear(),
                          nextMonth.getMonth() + 1,
                          0, // 다음 달의 0일 = 이번 달의 마지막 날
                      );

            const targetYyyy = String(targetDate.getFullYear());
            const targetMm = String(targetDate.getMonth() + 1).padStart(2, "0");
            const targetDd = String(targetDate.getDate()).padStart(2, "0");

            setSelectedDate(`${targetYyyy}-${targetMm}-${targetDd}`);

            return nextMonth;
        });
    };

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        touchStartX.current = event.clientX;
        touchStartY.current = event.clientY;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) {
            return;
        }

        const deltaX = event.clientX - touchStartX.current;
        const deltaY = event.clientY - touchStartY.current;

        touchStartX.current = null;
        touchStartY.current = null;

        if (
            Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
            Math.abs(deltaX) < Math.abs(deltaY)
        ) {
            return;
        }

        if (deltaX < 0) {
            goToMonth(1);
        } else {
            goToMonth(-1);
        }
    };

    const handlePointerCancel = () => {
        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        <div className="flex-1 bg-black-900  text-black-100">
            <div className="flex flex-col gap-5">
                <CalendarTopBar
                    monthLabel={MONTH_LABELS[currentMonth.getMonth()]}
                    year={currentMonth.getFullYear()}
                    viewMode={viewMode}
                    onStatsClick={handleToggleViewMode}
                />

                <div
                    className="touch-pan-y px-5"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    <CalendarGrid
                        monthDays={monthDays}
                        selectedDate={selectedDate}
                        viewMode={viewMode}
                        onSelectDate={handleSelectDate}
                        onPrevMonth={() => goToMonth(-1)}
                        onNextMonth={() => goToMonth(1)}
                    />
                </div>
            </div>

            <CalendarTaskSheet
                selectedDate={selectedDate}
                tasks={selectedDateTasks}
                viewMode={viewMode}
                dailyFeedback={selectedDailyFeedback}
                dailyStat={selectedDailyStat}
            />
        </div>
    );
};

import { useEffect, useMemo, useRef, useState } from "react";

import { mockCalendarTasks as mockTasks } from "@/mocks/calendarTasks";
import {
    fetchMonthlyCalendarStats,
    fetchDailyFeedback,
} from "@/api/calendar/stats";
import type { DailyStat, DailyFeedbackData } from "@/types/calendarStats";

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
        const tasksForDay = mockTasks.filter(
            (task) => task.deadline === dateKey,
        );
        const dailyStat = dailyStatsByDate[dateKey];

        return {
            key: dateKey,
            day: cellDate.getDate(),
            isCurrentMonth: cellDate.getMonth() === month,
            isToday: cellDate.toDateString() === today.toDateString(),
            dateStatus: getDateStatus(cellDate, today),
            tasks: tasksForDay,
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

    // 선택한 날짜의 피드백(완료된 과업 목록 + 소요/권장 시간)
    const [dailyFeedbackResult, setDailyFeedbackResult] = useState<{
        date: string;
        data: DailyFeedbackData;
    } | null>(null);
    // currentMonth가 바뀔 때마다 월별 통계 재조회
    useEffect(() => {
        let isCancelled = false;

        const loadMonthlyStats = async () => {
            try {
                const result = await fetchMonthlyCalendarStats(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                );

                if (isCancelled) return;

                //====테스트 코드=====
                if (import.meta.env.DEV) {
                    console.log(
                        "[CalendarPage] monthly stats 전체 응답:",
                        result,
                    );

                    const todayStat = result.dailyStats.find(
                        (stat) => stat.date === defaultDateKey,
                    );
                    console.log(
                        "[CalendarPage] 오늘(",
                        defaultDateKey,
                        ") actualMinutes:",
                        todayStat?.actualMinutes,
                        "/ recommendedMinutes:",
                        todayStat?.recommendedMinutes,
                    );
                }
                //====테스트 코드=====

                const statsByDate = result.dailyStats.reduce<
                    Record<string, DailyStat>
                >((accumulator, stat) => {
                    accumulator[stat.date] = stat;
                    return accumulator;
                }, {});

                setDailyStatsByDate(statsByDate);
            } catch {
                if (!isCancelled) {
                    setDailyStatsByDate({});
                }
            }
        };

        loadMonthlyStats();

        return () => {
            isCancelled = true;
        };
    }, [currentMonth]);

    // selectedDate가 바뀔 때마다 일별 피드백 재조회
    useEffect(() => {
        if (!selectedDate) return;

        let isCancelled = false;

        const loadDailyFeedback = async () => {
            try {
                const result = await fetchDailyFeedback(selectedDate);

                //======테스트용 코드======
                if (import.meta.env.DEV) {
                    console.log(
                        "[CalendarPage] daily stats 응답:",
                        selectedDate,
                        result,
                    );
                }
                ///======테스트용 코드======

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

    const monthDays = useMemo(
        () => getDaysInMonth(currentMonth, dailyStatsByDate),
        [currentMonth, dailyStatsByDate],
    );

    const selectedTasks = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        return mockTasks.filter((task) => task.deadline === selectedDate);
    }, [selectedDate]);

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
        setCurrentMonth(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
        );
        setSelectedDate(null);
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
        <div className="flex-1 bg-black-900 px-5 pt-5 text-black-100">
            <div className="flex flex-col gap-5">
                <CalendarTopBar
                    monthLabel={MONTH_LABELS[currentMonth.getMonth()]}
                    year={currentMonth.getFullYear()}
                    viewMode={viewMode}
                    onStatsClick={handleToggleViewMode}
                />

                <div
                    className="touch-pan-y"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    <CalendarGrid
                        monthDays={monthDays}
                        selectedDate={selectedDate}
                        viewMode={viewMode}
                        onSelectDate={handleSelectDate}
                    />
                </div>
            </div>

            <CalendarTaskSheet
                selectedDate={selectedDate}
                tasks={selectedTasks}
                viewMode={viewMode}
                dailyFeedback={selectedDailyFeedback}
                dailyStat={selectedDailyStat}
            />
        </div>
    );
};

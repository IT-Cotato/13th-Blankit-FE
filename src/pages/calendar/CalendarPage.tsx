import { useMemo, useRef, useState } from "react";

import { mockCalendarTasks as mockTasks } from "@/mocks/calendarTasks";
import {
    mockDailyStatsByDate,
    mockDailyFeedbackByDate,
} from "@/mocks/calendarStats";

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

// 스와이프로 월 전환을 트리거할 최소 드래그 거리(px).
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

const getDaysInMonth = (date: Date): CalendarDayCell[] => {
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
        const dailyStat = mockDailyStatsByDate[dateKey];

        return {
            key: dateKey,
            day: cellDate.getDate(),
            isCurrentMonth: cellDate.getMonth() === month,
            isToday: cellDate.toDateString() === today.toDateString(),
            dateStatus: getDateStatus(cellDate, today),
            tasks: tasksForDay,
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

    // 현재 화면에 보여줄 월(1일 기준). 스와이프/버튼으로 이동합니다.
    const [currentMonth, setCurrentMonth] = useState<Date>(
        () => new Date(today.getFullYear(), today.getMonth(), 1),
    );

    const monthDays = useMemo(
        () => getDaysInMonth(currentMonth),
        [currentMonth],
    );

    const selectedTasks = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        return mockTasks.filter((task) => task.deadline === selectedDate);
    }, [selectedDate]);

    const selectedDailyFeedback = useMemo(() => {
        if (!selectedDate) return null;
        return mockDailyFeedbackByDate[selectedDate] ?? null;
    }, [selectedDate]);

    // 날짜 뱃지 채움 비율 계산용 월별 요약 통계.
    // viewMode와 무관하게 항상 조회해서 CalendarTaskSheet에 넘깁니다.
    const selectedDailyStat = useMemo(() => {
        if (!selectedDate) return null;
        return mockDailyStatsByDate[selectedDate] ?? null;
    }, [selectedDate]);

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
        // 이전/다음 달로 넘어가면 선택 상태를 비웁니다.
        // (선택했던 날짜가 새 달엔 존재하지 않을 수 있어서요.)
        setSelectedDate(null);
    };

    // ---- 스와이프 감지 (Pointer Events, 별도 라이브러리 없이) ----
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

        // 세로 스크롤/드래그와 헷갈리지 않도록, 가로 이동이 세로 이동보다
        // 뚜렷하게 클 때만 스와이프로 인정합니다.
        if (
            Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
            Math.abs(deltaX) < Math.abs(deltaY)
        ) {
            return;
        }

        if (deltaX < 0) {
            goToMonth(1); // 왼쪽으로 스와이프 → 다음 달
        } else {
            goToMonth(-1); // 오른쪽으로 스와이프 → 이전 달
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

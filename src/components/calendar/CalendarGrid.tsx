import type { CalendarTaskDot } from "@/types/calendarMonthlyTasks";
import { CalendarDayButton } from "@/components/calendar/CalendarDayButton";
import { CalendarStatsFillCell } from "./CalendarStatsFillCell";
import { CalendarMonthNavButton } from "@/components/calendar/CalendarMonthNavButton";
import { useState, useEffect } from "react";

export type CalendarViewMode = "default" | "stats";
export type CalendarDateStatus = "past" | "today" | "future";

export interface CalendarDayCell {
    key: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    dateStatus: CalendarDateStatus;
    tasks: CalendarTaskDot[];
    actualMinutes: number;
    recommendedMinutes: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
    monthDays: CalendarDayCell[];
    selectedDate: string | null;
    viewMode: CalendarViewMode;
    onSelectDate: (dateKey: string) => void;
    onPrevMonth?: () => void;
    onNextMonth?: () => void;
}

export const CalendarGrid = ({
    monthDays,
    selectedDate,
    viewMode,
    onSelectDate,
    onPrevMonth,
    onNextMonth,
}: CalendarGridProps) => {
    const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(
        null,
    );

    const [canHover, setCanHover] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(hover: hover) and (pointer: fine)",
        );

        const handleChange = (event: MediaQueryListEvent) => {
            setCanHover(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const canNavigate = Boolean(onPrevMonth && onNextMonth) && canHover;

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        if (!canNavigate) return;

        const { left, width } = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - left;

        setHoveredSide(offsetX < width / 2 ? "left" : "right");
    };

    const handleMouseLeave = () => {
        if (!canNavigate) return;
        setHoveredSide(null);
    };

    return (
        <section
            id="calendar-grid"
            className="relative rounded-2xl border px-5 pt-5 border-black-800 bg-black-850 p-[18px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {canNavigate && (
                <>
                    <CalendarMonthNavButton
                        direction="prev"
                        visible={hoveredSide === "left"}
                        onClick={onPrevMonth!}
                    />
                    <CalendarMonthNavButton
                        direction="next"
                        visible={hoveredSide === "right"}
                        onClick={onNextMonth!}
                    />
                </>
            )}

            <div className="grid grid-cols-7 gap-2 text-center">
                {WEEKDAYS.map((weekday) => (
                    <span
                        key={weekday}
                        className="text-[12px] font-medium text-black-600"
                    >
                        {weekday}
                    </span>
                ))}

                {monthDays.map((day) => {
                    if (!day.isCurrentMonth) {
                        return (
                            <div
                                key={day.key}
                                className="flex h-10.5 items-center justify-center"
                                aria-hidden="true"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="5"
                                    height="5"
                                    viewBox="0 0 5 5"
                                    fill="none"
                                >
                                    <circle
                                        cx="2.5"
                                        cy="2.5"
                                        r="2.5"
                                        fill="#505357"
                                    />
                                </svg>
                            </div>
                        );
                    }

                    if (viewMode === "stats") {
                        return (
                            <CalendarStatsFillCell
                                key={day.key}
                                day={day.day}
                                dateStatus={day.dateStatus}
                                actualMinutes={day.actualMinutes}
                                recommendedMinutes={day.recommendedMinutes}
                                isSelected={day.key === selectedDate}
                                onSelect={() => onSelectDate(day.key)}
                            />
                        );
                    }

                    return (
                        <CalendarDayButton
                            key={day.key}
                            day={day}
                            isSelected={day.key === selectedDate}
                            onSelect={onSelectDate}
                        />
                    );
                })}
            </div>
        </section>
    );
};

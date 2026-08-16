import type { Task } from "@/types/task";
import { CalendarDayButton } from "@/components/calendar/CalendarDayButton";
import { CalendarStatsFillCell } from "./CalendarStatsFillCell";

export type CalendarViewMode = "default" | "stats";
export type CalendarDateStatus = "past" | "today" | "future";

export interface CalendarDayCell {
    key: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    dateStatus: CalendarDateStatus;
    tasks: Task[];
    actualMinutes: number;
    recommendedMinutes: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
    monthDays: CalendarDayCell[];
    selectedDate: string | null;
    viewMode: CalendarViewMode;
    onSelectDate: (dateKey: string) => void;
}

export const CalendarGrid = ({
    monthDays,
    selectedDate,
    viewMode,
    onSelectDate,
}: CalendarGridProps) => {
    return (
        <section
            id="calendar-grid"
            className="rounded-2xl border px-5 pt-5 border-black-800 bg-black-850 p-[18px]"
        >
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

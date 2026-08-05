import type { Task } from "@/types/task";

export interface CalendarDayCell {
    key: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    tasks: Task[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
    monthDays: CalendarDayCell[];
    onSelectDate: (dateKey: string) => void;
}

export const CalendarGrid = ({
    monthDays,
    onSelectDate,
}: CalendarGridProps) => {
    return (
        // id="calendar-grid": CalendarTaskSheet가 캘린더 하단 위치를 측정하는 데 씁니다.
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

                    const handleSelect = () => {
                        onSelectDate(day.key);
                    };

                    return (
                        <button
                            key={day.key}
                            type="button"
                            onClick={handleSelect}
                            className={`flex h-10.5 flex-col items-center justify-center rounded-[10px] bg-black-800 ${
                                day.isToday ? "border border-green-500" : ""
                            }`}
                        >
                            <span
                                style={{
                                    color: day.isToday
                                        ? "var(--green-500, #22C55E)"
                                        : "var(--black-300, #DFE1E4)",
                                    textAlign: "center",
                                    fontFamily: "Pretendard",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "150%",
                                    letterSpacing: "-0.21px",
                                }}
                            >
                                {day.day}
                            </span>
                            <div className="mt-1 flex items-center justify-center gap-1">
                                {day.tasks.map((task) => (
                                    <span
                                        key={`${day.key}-${task.taskId}`}
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                task.category.color,
                                        }}
                                    />
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

import type {
    CalendarDayCell,
    CalendarViewMode,
} from "@/components/calendar/CalendarGrid";

interface CalendarDayButtonProps {
    day: CalendarDayCell;
    isSelected: boolean;
    viewMode: CalendarViewMode;
    onSelect: (dateKey: string) => void;
}

// 분 단위 값을 "H:MM" 형태로 변환합니다 (예: 210분 -> "03:30").
const formatElapsedMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
};

export const CalendarDayButton = ({
    day,
    isSelected,
    viewMode,
    onSelect,
}: CalendarDayButtonProps) => {
    const handleClick = () => {
        onSelect(day.key);
    };

    const hasElapsedTime = day.totalElapsedMinutes > 0;

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={isSelected}
            className={`flex h-10.5 flex-col items-center justify-center rounded-[10px] bg-black-800 ${
                day.isToday ? "border border-green-500" : ""
            }`}
        >
            <span
                className={`text-center font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] ${
                    isSelected ? "text-green-500" : "text-black-300"
                }`}
            >
                {day.day}
            </span>

            {viewMode === "stats" ? (
                <span className="mt-1 text-[10px] font-medium leading-none text-black-600">
                    {hasElapsedTime
                        ? formatElapsedMinutes(day.totalElapsedMinutes)
                        : ""}
                </span>
            ) : (
                <div className="mt-1 flex items-center justify-center gap-1">
                    {day.tasks.map((task) => (
                        <span
                            key={`${day.key}-${task.taskId}`}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                                backgroundColor: task.category.color,
                            }}
                        />
                    ))}
                </div>
            )}
        </button>
    );
};

import type { CalendarDayCell } from "@/components/calendar/CalendarGrid";

interface CalendarDayButtonProps {
    day: CalendarDayCell;
    isSelected: boolean;
    onSelect: (dateKey: string) => void;
}

export const CalendarDayButton = ({
    day,
    isSelected,
    onSelect,
}: CalendarDayButtonProps) => {
    const handleClick = () => {
        onSelect(day.key);
    };

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
        </button>
    );
};

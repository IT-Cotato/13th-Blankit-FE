import { CalendarDayCellShell } from "@/components/calendar/CalendarDayCellShell";
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
    return (
        <CalendarDayCellShell
            isSelected={isSelected}
            onSelect={() => onSelect(day.key)}
        >
            <span
                className={`text-center font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] ${
                    day.isToday ? "text-green-500" : "text-black-300"
                }`}
            >
                {day.day}
            </span>

            <div className="mt-[2px] flex items-center justify-center gap-1">
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
        </CalendarDayCellShell>
    );
};

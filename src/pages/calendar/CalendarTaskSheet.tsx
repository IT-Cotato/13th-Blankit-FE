import { useState } from "react";

import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { useBottomSheetSnap } from "@/hooks/useBottomSheetSnap";
import type { Task } from "@/types/task";

interface CalendarTaskSheetProps {
    selectedDate: string | null;
    tasks: Task[];
    onClose: () => void;
}

const formatDisplayDate = (date: string | null) => {
    if (!date) return "";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;

    const day = parsedDate.getDate();
    const weekday = parsedDate.toLocaleDateString("ko-KR", { weekday: "long" });

    return `${parsedDate.getMonth() + 1}월 ${day}일 ${weekday}`;
};

export const CalendarTaskSheet = ({
    selectedDate,
    tasks,
}: CalendarTaskSheetProps) => {
    const { navBarHeight, sheetHeight, isDragging, isFull, dragHandleProps } =
        useBottomSheetSnap({
            headerSelector: "#calendar-header",
            contentBottomSelector: "#calendar-grid",
        });

    // 마지막으로 선택된 날짜/과업을 유지합니다 (시트는 사라지지 않으므로).
    const [displayDate, setDisplayDate] = useState<string | null>(selectedDate);
    const [displayTasks, setDisplayTasks] = useState<Task[]>(tasks);
    const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

    if (selectedDate !== prevSelectedDate) {
        setPrevSelectedDate(selectedDate);
        if (selectedDate) {
            setDisplayDate(selectedDate);
            setDisplayTasks(tasks);
        }
    }

    const isListScrollable = isFull && !isDragging;
    const sheetTitle = formatDisplayDate(displayDate);

    return (
        <div
            className="fixed inset-x-0 z-60 flex justify-center px-5"
            style={{ bottom: navBarHeight }}
        >
            <div
                className={`flex w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] border border-black-800 bg-black-850 px-5 pt-3 ${
                    isDragging
                        ? ""
                        : "transition-[height] duration-300 ease-out"
                }`}
                style={{ height: sheetHeight }}
            >
                <div
                    className="flex w-full cursor-grab flex-col items-center gap-4 touch-none"
                    {...dragHandleProps}
                >
                    <span className="h-1 w-9 rounded-full bg-black-700" />

                    <div className="flex w-full items-center">
                        <div className="flex items-center gap-2 rounded-xl bg-black-800 px-3 py-2">
                            <span className="h-4 w-4 flex-shrink-0 rounded-[4px] bg-green-500" />
                            <span
                                className="text-[14px] font-medium text-black-100"
                                style={{
                                    fontFamily: "Pretendard",
                                    lineHeight: "150%",
                                    letterSpacing: "-0.21px",
                                }}
                            >
                                {sheetTitle}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className={`mt-4 flex w-full flex-1 flex-col items-start gap-5 ${
                        isListScrollable ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                >
                    {displayTasks.length === 0 ? (
                        <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-black-800 bg-black-800/70 px-4 py-6 text-[14px] font-medium text-black-500">
                            해당 날짜에는 등록된 과업이 없어요.
                        </div>
                    ) : (
                        displayTasks.map((task) => (
                            <CalendarTaskCard key={task.taskId} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

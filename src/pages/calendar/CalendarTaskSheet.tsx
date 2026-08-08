import { useState } from "react";

import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { TaskChip } from "@/components/task/TaskChip";
import { useBottomSheetSnap } from "@/hooks/useBottomSheetSnap";
import type { CalendarViewMode } from "@/components/calendar/CalendarGrid";
import type { DailyFeedbackData } from "@/types/calendarStats";
import type { Category, CategoryIconKey } from "@/types/category";
import type { Task } from "@/types/task";

interface CalendarTaskSheetProps {
    selectedDate: string | null;
    tasks: Task[];
    viewMode: CalendarViewMode;
    // 통계 모드에서 선택 날짜의 상세 데이터. 아직 fetch 전이거나 로딩 중이면 null.
    dailyFeedback: DailyFeedbackData | null;
    onClose: () => void;
    onTaskClick?: (taskId: string) => void;
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
    viewMode,
    dailyFeedback,
    onTaskClick,
}: CalendarTaskSheetProps) => {
    const { navBarHeight, sheetHeight, isDragging, isFull, dragHandleProps } =
        useBottomSheetSnap({
            headerSelector: "#calendar-header",
            contentBottomSelector: "#calendar-grid",
        });

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

    // 3.6.1: 오늘인데 피드백 없음 / 미래 날짜 선택 → "아직 기록이 없어요"
    // feedbackTasks가 비어있는 모든 경우로 일반화했습니다 (과거인데 기록 없는 경우도 동일 문구가 자연스러워서요).
    const hasNoFeedback =
        viewMode === "stats" &&
        (dailyFeedback === null || dailyFeedback.feedbackTasks.length === 0);

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
                    className={`mt-4 flex w-full flex-1 flex-col items-start gap-3 ${
                        isListScrollable ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                >
                    {viewMode === "stats" ? (
                        hasNoFeedback ? (
                            <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-black-800 bg-black-800/70 px-4 py-6 text-[14px] font-medium text-black-500">
                                아직 기록이 없어요
                            </div>
                        ) : (
                            <ul className="flex w-full flex-col gap-3">
                                {dailyFeedback!.feedbackTasks.map((task) => (
                                    <li key={task.taskId}>
                                        <TaskChip
                                            title={task.title}
                                            lastMemo={task.categoryName}
                                            progressRate={task.progressRate}
                                            priority="MEDIUM"
                                            status={
                                                task.isCompleted
                                                    ? "DONE"
                                                    : "IN_PROGRESS"
                                            }
                                            category={{
                                                // feedbackTasks엔 categoryId가 없어서 taskId로 임시 대체합니다.
                                                // getCategoryPresentation이 categoryId로 다른 조회/조건 분기를 하지 않는다면 문제없어요.
                                                categoryId: task.taskId,
                                                categoryName: task.categoryName,
                                                color: task.categoryColor,
                                                iconKey:
                                                    task.categoryIconKey as CategoryIconKey,
                                            }}
                                            onClick={() =>
                                                onTaskClick?.(
                                                    String(task.taskId),
                                                )
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : displayTasks.length === 0 ? (
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

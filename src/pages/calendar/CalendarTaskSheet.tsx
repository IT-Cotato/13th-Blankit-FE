import { useEffect, useRef, useState } from "react";
import { CalendarDateBadge } from "@/components/calendar/CalendarDateBadge";
import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState";
import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { TaskChip } from "@/components/task/TaskChip";
import { useBottomSheetSnap } from "@/hooks/useBottomSheetSnap";
import type { CalendarViewMode } from "@/components/calendar/CalendarGrid";
import type { DailyFeedbackData, DailyStat } from "@/types/calendarStats";
import type { CategoryIconKey } from "@/types/category";
import type { TaskListResponse } from "@/types/taskApi";

interface CalendarTaskSheetProps {
    selectedDate: string | null;
    tasks: TaskListResponse[];
    viewMode: CalendarViewMode;
    dailyFeedback: DailyFeedbackData | null;
    dailyStat: DailyStat | null;
    onTaskClick?: (taskId: string) => void;
}

export const CalendarTaskSheet = ({
    selectedDate,
    tasks,
    viewMode,
    dailyFeedback,
    dailyStat,
    onTaskClick,
}: CalendarTaskSheetProps) => {
    const { navBarHeight, sheetHeight, isDragging, isFull, dragHandleProps } =
        useBottomSheetSnap({
            contentBottomSelector: "#calendar-grid",
        });

    // EmptyState의 내부 레이아웃 선택(flex-row/flex-col)과 무관하게 정해지는,
    // 콘텐츠 영역 자체의 가용 높이. sheetHeight(드래그로 결정)에서 파생되므로
    // 자기참조 없이 안정적으로 측정 가능
    const contentAreaRef = useRef<HTMLDivElement>(null);
    const [contentAreaHeight, setContentAreaHeight] = useState(0);

    useEffect(() => {
        const element = contentAreaRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setContentAreaHeight(entry.contentRect.height);
        });

        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    const isListScrollable = isFull && !isDragging;

    const hasNoFeedback =
        viewMode === "stats" &&
        (dailyFeedback === null || dailyFeedback.feedbackTasks.length === 0);

    const hasNoTasks = viewMode === "default" && tasks.length === 0;

    const showEmptyState = hasNoFeedback || hasNoTasks;

    const fillMinutes = {
        actualMinutes: dailyStat?.actualMinutes ?? 0,
        recommendedMinutes: dailyStat?.recommendedMinutes ?? 0,
    };

    return (
        <div
            className="fixed sm:max-w-[641px] mx-auto inset-x-0 z-60 flex justify-center"
            style={{ bottom: navBarHeight }}
        >
            <div
                className={`flex w-full flex-col overflow-hidden rounded-t-[20px] border border-black-800 bg-black-850 px-5 pt-3 ${
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
                        <CalendarDateBadge
                            date={selectedDate}
                            actualMinutes={fillMinutes.actualMinutes}
                            recommendedMinutes={fillMinutes.recommendedMinutes}
                        />
                    </div>
                </div>

                <div
                    ref={contentAreaRef}
                    className={`mt-4 flex w-full flex-1 flex-col items-start gap-3 ${
                        isListScrollable ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                >
                    {showEmptyState ? (
                        <CalendarEmptyState
                            recommendedMinutes={fillMinutes.recommendedMinutes}
                            availableHeight={contentAreaHeight}
                        />
                    ) : viewMode === "stats" ? (
                        <ul className="flex w-full flex-col gap-3">
                            {dailyFeedback!.feedbackTasks.map((task) => (
                                <li key={task.taskId}>
                                    <TaskChip
                                        title={task.title}
                                        memo={task.memo ?? ""}
                                        progressRate={task.progressRate}
                                        priority="MEDIUM"
                                        status={
                                            task.isCompleted
                                                ? "DONE"
                                                : "IN_PROGRESS"
                                        }
                                        backgroundClassName="bg-black-800"
                                        category={{
                                            categoryId: task.taskId,
                                            categoryName: task.categoryName,
                                            color: task.categoryColor,
                                            iconKey:
                                                task.categoryIconKey as CategoryIconKey,
                                        }}
                                        onClick={() =>
                                            onTaskClick?.(String(task.taskId))
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        tasks.map((task) => (
                            <CalendarTaskCard key={task.taskId} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

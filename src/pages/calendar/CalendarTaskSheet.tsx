import { useState } from "react";

import { CalendarDateBadge } from "@/components/calendar/CalendarDateBadge";
import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState";
import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { TaskChip } from "@/components/task/TaskChip";
import { useBottomSheetSnap } from "@/hooks/useBottomSheetSnap";
import type { CalendarViewMode } from "@/components/calendar/CalendarGrid";
import type { DailyFeedbackData, DailyStat } from "@/types/calendarStats";
import type { CategoryIconKey } from "@/types/category";
import type { Task } from "@/types/task";

interface CalendarTaskSheetProps {
    selectedDate: string | null;
    tasks: Task[];
    viewMode: CalendarViewMode;
    // 통계 모드에서 선택 날짜의 상세 데이터. 아직 fetch 전이거나 로딩 중이면 null.
    dailyFeedback: DailyFeedbackData | null;
    // 선택 날짜의 월별 요약 통계 (actualMinutes/recommendedMinutes).
    // viewMode와 무관하게 항상 존재할 수 있는 데이터라, 날짜 뱃지 채움 비율은
    // 이 값을 기준으로 계산합니다. 데이터가 아직 없으면 null.
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

    const [displayDate, setDisplayDate] = useState<string | null>(selectedDate);
    const [displayTasks, setDisplayTasks] = useState<Task[]>(tasks);
    const [displayStat, setDisplayStat] = useState<DailyStat | null>(dailyStat);
    const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

    if (selectedDate !== prevSelectedDate) {
        setPrevSelectedDate(selectedDate);
        if (selectedDate) {
            setDisplayDate(selectedDate);
            setDisplayTasks(tasks);
            setDisplayStat(dailyStat);
        }
    }

    const isListScrollable = isFull && !isDragging;

    const hasNoFeedback =
        viewMode === "stats" &&
        (dailyFeedback === null || dailyFeedback.feedbackTasks.length === 0);

    const hasNoTasks = viewMode === "default" && displayTasks.length === 0;

    const showEmptyState = hasNoFeedback || hasNoTasks;

    const fillMinutes = {
        actualMinutes: displayStat?.actualMinutes ?? 0,
        recommendedMinutes: displayStat?.recommendedMinutes ?? 0,
    };

    return (
        <div
            className="fixed inset-x-0 z-60 flex justify-center"
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
                            date={displayDate}
                            actualMinutes={fillMinutes.actualMinutes}
                            recommendedMinutes={fillMinutes.recommendedMinutes}
                        />
                    </div>
                </div>

                <div
                    className={`mt-4 flex w-full flex-1 flex-col items-start gap-3 ${
                        isListScrollable ? "overflow-y-auto" : "overflow-hidden"
                    }`}
                >
                    {showEmptyState ? (
                        <CalendarEmptyState
                            recommendedMinutes={fillMinutes.recommendedMinutes}
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
                        displayTasks.map((task) => (
                            <CalendarTaskCard key={task.taskId} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

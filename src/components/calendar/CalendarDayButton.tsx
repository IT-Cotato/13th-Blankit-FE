import { CalendarDayCellShell } from "@/components/calendar/CalendarDayCellShell";
import type { CalendarDayCell } from "@/components/calendar/CalendarGrid";
import { useMaxVisibleDots } from "@/hooks/useMaxVisibleDots";

interface CalendarDayButtonProps {
    day: CalendarDayCell;
    isSelected: boolean;
    onSelect: (dateKey: string) => void;
}

interface CategoryAggregate {
    color: string;
    taskCount: number;
    totalEstimatedTime: number;
    firstSeenIndex: number; // tasks 배열 등장 순 — 최종 표시 순서의 유일한 기준
}

// tasks.length가 maxDots 이하면 과업 하나당 점 하나(중복 색상 허용), 등장 순 그대로
// tasks.length가 maxDots 초과면:
//   1) "얼마나 보여줄지" 배분 결정은 우선순위(개수 desc → estimatedTime 합계 desc → 등장순 asc)로 계산
//   2) 최종 나열 순서는 항상 firstSeenIndex(등장 순) 기준으로 고정
//      → maxDots가 바뀌어도(가로 폭 변화) 남아있는 카테고리들의 좌우 배치 순서는 유지됨
const getVisibleDotColors = (
    tasks: CalendarDayCell["tasks"],
    maxDots: number,
): string[] => {
    if (tasks.length <= maxDots) {
        return tasks.map((task) => task.categoryColor);
    }

    const aggregateByColor = new Map<string, CategoryAggregate>();

    tasks.forEach((task, index) => {
        const existing = aggregateByColor.get(task.categoryColor);

        if (existing) {
            existing.taskCount += 1;
            existing.totalEstimatedTime += task.estimatedTime ?? 0;
        } else {
            aggregateByColor.set(task.categoryColor, {
                color: task.categoryColor,
                taskCount: 1,
                totalEstimatedTime: task.estimatedTime ?? 0,
                firstSeenIndex: index,
            });
        }
    });

    // 배분/컷 결정 전용 — 우선순위 정렬 (표시 순서에는 쓰지 않음)
    const priorityRanked = Array.from(aggregateByColor.values()).sort(
        (a, b) => {
            if (b.taskCount !== a.taskCount) {
                return b.taskCount - a.taskCount;
            }
            if (b.totalEstimatedTime !== a.totalEstimatedTime) {
                return b.totalEstimatedTime - a.totalEstimatedTime;
            }
            return a.firstSeenIndex - b.firstSeenIndex;
        },
    );

    // 카테고리 종류 수 >= maxDots: 우선순위 상위 maxDots개 카테고리만 선택(각 1개)
    // 선택된 카테고리들을 등장 순으로 재정렬해서 반환
    if (priorityRanked.length >= maxDots) {
        const selected = new Set(
            priorityRanked.slice(0, maxDots).map((c) => c.color),
        );

        return priorityRanked
            .filter((c) => selected.has(c.color))
            .sort((a, b) => a.firstSeenIndex - b.firstSeenIndex)
            .map((c) => c.color);
    }

    // 카테고리 종류 수 < maxDots: 모든 카테고리 최소 1개씩 표시
    // 남는 슬롯은 우선순위(개수 많은 카테고리부터)로 추가 배분
    const allocation = new Map<string, number>(
        priorityRanked.map((c) => [c.color, 1]),
    );
    let remainingSlots = maxDots - priorityRanked.length;

    for (const category of priorityRanked) {
        if (remainingSlots <= 0) break;

        const extraCapacity = category.taskCount - 1;
        const extra = Math.min(extraCapacity, remainingSlots);

        allocation.set(category.color, allocation.get(category.color)! + extra);
        remainingSlots -= extra;
    }

    // 최종 나열은 등장 순(firstSeenIndex)으로 고정, 각 카테고리를 배정된 개수만큼 반복
    return Array.from(aggregateByColor.values())
        .sort((a, b) => a.firstSeenIndex - b.firstSeenIndex)
        .flatMap((category) =>
            Array(allocation.get(category.color)).fill(category.color),
        );
};

export const CalendarDayButton = ({
    day,
    isSelected,
    onSelect,
}: CalendarDayButtonProps) => {
    const { containerRef, maxDots } = useMaxVisibleDots();
    const visibleColors = getVisibleDotColors(day.tasks, maxDots);

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

            <div
                ref={containerRef}
                className="mt-[2px] flex w-full items-center justify-center gap-[2px]"
            >
                {visibleColors.map((color, index) => (
                    <span
                        key={`${day.key}-${color}-${index}`}
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </CalendarDayCellShell>
    );
};

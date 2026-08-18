import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { CATEGORY_ICON_MAP } from "@/constants/category";
import type { TaskListResponse } from "@/types/taskApi";

interface CalendarTaskCardProps {
    task: TaskListResponse;
}

function formatEstimatedTime(minutes: number | null) {
    if (minutes === null) return "소요 시간 미정";
    if (minutes < 60) return `${minutes}분 소요`;
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return restMinutes === 0
        ? `${hours}시간 소요`
        : `${hours}시간 ${restMinutes}분 소요`;
}

export function CalendarTaskCard({ task }: CalendarTaskCardProps) {
    const icon = CATEGORY_ICON_MAP[task.category.iconKey] ?? "";

    return (
        <article className="flex w-full items-center gap-3 rounded-2xl border border-black-800 bg-black-800 px-4 py-3">
            <CategoryIconBadge
                icon={icon}
                color={task.category.color}
                size={40}
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <p
                        className="truncate text-[16px] font-semibold leading-[150%] tracking-[-0.24px] text-black-100"
                        style={{ fontFamily: "Pretendard" }}
                    >
                        {task.title}
                    </p>

                    <p className="text-[12px] font-medium text-black-650">
                        {formatEstimatedTime(task.estimatedTime)}
                    </p>
                </div>
            </div>
        </article>
    );
}

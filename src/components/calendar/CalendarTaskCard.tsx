import { CategoryIconBadge } from "@/components/category/CategoryIconBadge";
import { CATEGORY_ICON_MAP } from "@/constants/category";
import type { Task } from "@/types/task";

interface CalendarTaskCardProps {
    task: Task;
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

                    <p className="text-[12px] font-medium text-black-500">
                        {task.estimatedTime >= 60
                            ? `${Math.floor(task.estimatedTime / 60)}시간 소요`
                            : `${task.estimatedTime}분 소요`}
                    </p>
                </div>
            </div>
        </article>
    );
}

import { formatMinutesAsClock } from "@/utils/calendarRecommendedTime";
import sleepBunnyIcon from "@/assets/icons/calendar/sleep-bunny.svg";

interface CalendarEmptyStateProps {
    recommendedMinutes: number;
}

export const CalendarEmptyState = ({
    recommendedMinutes,
}: CalendarEmptyStateProps) => {
    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 py-10">
            <img src={sleepBunnyIcon} alt="" className="h-[44px] w-[34px]" />
            <span className="text-[14px] font-medium text-black-500">
                예상 시간 {formatMinutesAsClock(recommendedMinutes)}
            </span>
        </div>
    );
};

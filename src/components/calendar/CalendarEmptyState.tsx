import { formatMinutesAsClock } from "@/utils/calendarRecommendedTime";
import sleepBunnyIcon from "@/assets/icons/calendar/sleep-bunny.svg";

interface CalendarEmptyStateProps {
    recommendedMinutes: number;
    // 부모(CalendarTaskSheet)가 측정한, 이 컴포넌트 자신의 레이아웃과 무관한
    // 콘텐츠 영역의 실제 가용 높이. 자기참조 관찰(자기 높이→자기 레이아웃→자기 높이)을
    // 피하기 위해 부모가 안정적으로 측정한 값을 그대로 전달받음
    availableHeight: number;
}

const COMPACT_HEIGHT_THRESHOLD_PX = 90;

export const CalendarEmptyState = ({
    recommendedMinutes,
    availableHeight,
}: CalendarEmptyStateProps) => {
    // availableHeight가 아직 측정 전(0)이면 기본 세로 배치 유지
    const isCompact =
        availableHeight > 0 && availableHeight < COMPACT_HEIGHT_THRESHOLD_PX;

    return (
        <div
            className={`flex w-full flex-1 items-center justify-center gap-3 ${
                isCompact ? "flex-row py-3" : "flex-col"
            }`}
        >
            <img
                src={sleepBunnyIcon}
                alt=""
                className={
                    isCompact ? "h-6 w-[18px] shrink-0" : "h-[44px] w-[34px]"
                }
            />
            <span className="text-[14px] font-medium text-black-500">
                예상 시간 {formatMinutesAsClock(recommendedMinutes)}
            </span>
        </div>
    );
};

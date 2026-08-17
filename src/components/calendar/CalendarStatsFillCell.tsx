import type { CalendarDateStatus } from "@/components/calendar/CalendarGrid";
import { CalendarDayCellShell } from "@/components/calendar/CalendarDayCellShell";
import { CalendarFillIndicator } from "@/components/calendar/CalendarFillIndicator";
import { computeFilledLevel, TOTAL_CELLS } from "@/utils/calendarFillLevel";

// 분 단위 값을 "HH:MM" 형태로 변환합니다 (예: 210분 -> "03:30").
const formatMinutesAsClock = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
};

interface CalendarStatsFillCellProps {
    day: number;
    dateStatus: CalendarDateStatus;
    actualMinutes: number;
    recommendedMinutes: number;
    isSelected: boolean;
    onSelect: () => void;
}

export const CalendarStatsFillCell = ({
    day,
    dateStatus,
    actualMinutes,
    recommendedMinutes,
    isSelected,
    onSelect,
}: CalendarStatsFillCellProps) => {
    const isToday = dateStatus === "today";

    // 미래: 채움 배경 없음, 권장 시간만 텍스트로 표시
    if (dateStatus === "future") {
        return (
            <CalendarDayCellShell isSelected={isSelected} onSelect={onSelect}>
                <span className="font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] text-black-600">
                    {day}
                </span>
                <span className="mt-0.5 font-['Pretendard'] text-[9px] font-medium leading-none text-black-600">
                    {formatMinutesAsClock(recommendedMinutes)}
                </span>
            </CalendarDayCellShell>
        );
    }

    // 오늘 & 과거: 채움 배경 있음 (실제 수행 시간 / 권장 시간 비율)
    const filledLevel = computeFilledLevel(actualMinutes, recommendedMinutes);
    const isFullyAchieved = filledLevel >= TOTAL_CELLS;

    return (
        <CalendarDayCellShell
            isSelected={isSelected}
            onSelect={onSelect}
            dimBackgroundWhenSelected={isFullyAchieved}
            background={
                <CalendarFillIndicator
                    actualMinutes={actualMinutes}
                    recommendedMinutes={recommendedMinutes}
                    fillOpacity="half"
                    emptyVariant="muted"
                    className="h-full w-full"
                />
            }
        >
            <span
                className={`font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] ${
                    isToday
                        ? "text-green-500"
                        : isFullyAchieved && isSelected
                          ? "text-white"
                          : isFullyAchieved
                            ? "text-black-900"
                            : isSelected
                              ? "text-white"
                              : "text-black-100"
                }`}
            >
                {day}
            </span>
            {isToday && (
                <span className="mt-0.5 font-['Pretendard'] text-[9px] font-medium leading-none text-green-500">
                    {formatMinutesAsClock(actualMinutes)}
                </span>
            )}
        </CalendarDayCellShell>
    );
};

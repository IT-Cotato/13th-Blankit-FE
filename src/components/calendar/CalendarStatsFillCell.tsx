import type { CalendarDateStatus } from "@/components/calendar/CalendarGrid";

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE; // 25칸, 칸당 4%

const computeFilledLevel = (
    actualMinutes: number,
    recommendedMinutes: number,
) => {
    if (recommendedMinutes <= 0) {
        return actualMinutes > 0 ? TOTAL_CELLS : 0;
    }
    const ratio = actualMinutes / recommendedMinutes;
    return Math.min(TOTAL_CELLS, Math.floor(ratio * TOTAL_CELLS));
};

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
    // 오늘/미래: 아직 수행 데이터가 의미 없으니 채움 그래프 대신
    // 권장 시간을 라벨로만 보여줍니다. 오늘은 초록, 미래는 흐리게.
    if (dateStatus !== "past") {
        const isToday = dateStatus === "today";

        return (
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={isSelected}
                className={`flex h-10.5 w-full flex-col items-center justify-center rounded-[10px] bg-black-800 ${
                    isToday ? "border border-green-500" : ""
                }`}
            >
                <span
                    className={`font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] ${
                        isToday ? "text-green-500" : "text-black-600"
                    }`}
                >
                    {day}
                </span>
                <span
                    className={`mt-0.5 font-['Pretendard'] text-[9px] font-medium leading-none ${
                        isToday ? "text-green-500" : "text-black-600"
                    }`}
                >
                    {formatMinutesAsClock(recommendedMinutes)}
                </span>
            </button>
        );
    }

    const filledLevel = computeFilledLevel(actualMinutes, recommendedMinutes);
    const isFullyAchieved = filledLevel >= TOTAL_CELLS;
    const cellIndexes = Array.from({ length: TOTAL_CELLS }, (_, i) => i);

    if (isFullyAchieved) {
        return (
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={isSelected}
                className="flex h-10.5 w-full items-center justify-center rounded-[10px] bg-green-500"
            >
                <span className="font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] text-black-900">
                    {day}
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={isSelected}
            className="relative h-10.5 w-full overflow-hidden rounded-[10px] bg-black-800"
        >
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                {cellIndexes.map((index) => {
                    const isFilled = index < filledLevel;

                    return (
                        <span
                            key={index}
                            className={isFilled ? "bg-green-600/50" : ""}
                        />
                    );
                })}
            </div>

            <span
                className={`relative z-10 flex h-full w-full items-center justify-center font-['Pretendard'] text-[14px] font-medium leading-[150%] tracking-[-0.21px] ${
                    isSelected ? "text-white" : "text-black-100"
                }`}
            >
                {day}
            </span>
        </button>
    );
};

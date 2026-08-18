import { computeFilledLevel, TOTAL_CELLS } from "@/utils/calendarFillLevel";

interface CalendarFillIndicatorProps {
    actualMinutes: number;
    recommendedMinutes: number;
    // 크기/포지션(absolute, h-4 w-4 등)은 전부 호출부에서 결정합니다.
    className?: string;
    // 채워진 칸의 오퍼시티.
    // "half": 메인 캘린더 셀처럼 반투명(bg-green-600/50) — 기본값, 기존 동작 유지
    // "full": 날짜 뱃지처럼 항상 진한 초록(bg-green-500)
    fillOpacity?: "half" | "full";
    // 소요시간이 0(filledLevel 0)일 때 빈 상태를 어떻게 그릴지.
    // "muted": 기존처럼 무채색 배경만 (메인 캘린더 셀 기본값)
    // "outline": 검은 배경 + 초록 테두리 (날짜 뱃지에서 사용)
    emptyVariant?: "muted" | "outline";
    // 부분 채움(그리드) 상태일 때 컨테이너에 초록 테두리를 보일지 여부.
    // fillOpacity/emptyVariant와는 독립적인 옵션입니다.
    // 캘린더 셀: false(기본값, 기존처럼 테두리 없음) / 날짜 뱃지: true
    showPartialFillBorder?: boolean;
}

export const CalendarFillIndicator = ({
    actualMinutes,
    recommendedMinutes,
    className = "",
    fillOpacity = "half",
    emptyVariant = "muted",
    showPartialFillBorder = false,
}: CalendarFillIndicatorProps) => {
    const filledLevel = computeFilledLevel(actualMinutes, recommendedMinutes);
    const isFullyAchieved = filledLevel >= TOTAL_CELLS;

    if (isFullyAchieved) {
        return <span className={`block bg-green-500 ${className}`} />;
    }

    if (filledLevel <= 0) {
        const emptyClassName =
            emptyVariant === "outline"
                ? "border border-green-500 bg-black-800"
                : "bg-black-800";
        return <span className={`block ${emptyClassName} ${className}`} />;
    }

    const filledCellClassName =
        fillOpacity === "full" ? "bg-green-500" : "bg-green-600/50";
    const cellIndexes = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
    const borderClassName = showPartialFillBorder
        ? "border border-green-500"
        : "";

    return (
        <span
            className={`grid grid-cols-5 grid-rows-5 overflow-hidden bg-black-800 ${borderClassName} ${className}`}
        >
            {cellIndexes.map((index) => (
                <span
                    key={index}
                    className={index < filledLevel ? filledCellClassName : ""}
                />
            ))}
        </span>
    );
};

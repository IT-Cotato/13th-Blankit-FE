import type { ReactNode } from "react";

interface CalendarDayCellShellProps {
    isSelected: boolean;
    onSelect: () => void;
    // 배경 레이어. 기본은 단색 배경(backgroundClassName)이고,
    // 통계 모드 과거 셀처럼 CalendarFillIndicator 같은 복잡한 배경이 필요하면
    // background로 직접 노드를 넘깁니다. background가 있으면 backgroundClassName은 무시됩니다.
    background?: ReactNode;
    backgroundClassName?: string;
    // 완전 채움 + 선택 상태일 때 배경을 반투명 처리할지 여부 (통계 모드 과거 셀 전용).
    dimBackgroundWhenSelected?: boolean;
    children: ReactNode;
}

export const CalendarDayCellShell = ({
    isSelected,
    onSelect,
    background,
    backgroundClassName = "bg-black-800",
    dimBackgroundWhenSelected = false,
    children,
}: CalendarDayCellShellProps) => {
    const dimClassName =
        dimBackgroundWhenSelected && isSelected ? "opacity-50" : "";

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={isSelected}
            className={`relative flex h-10.5 w-full flex-col items-center justify-center overflow-hidden rounded-[10px] ${
                isSelected ? "border-[1px] border-green-500" : ""
            }`}
        >
            <div className={`absolute inset-0 ${dimClassName}`}>
                {background ?? (
                    <span
                        className={`block h-full w-full ${backgroundClassName}`}
                    />
                )}
            </div>
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-start p-[5px]">
                {children}
            </div>
        </button>
    );
};

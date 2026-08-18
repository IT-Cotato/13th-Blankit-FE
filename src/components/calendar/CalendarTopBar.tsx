import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";
import type { CalendarViewMode } from "@/components/calendar/CalendarGrid";
import statsIconGrey from "@/assets/icons/calendar/stats-icon-grey.svg";
import statsIconBlack from "@/assets/icons/calendar/stats-icon-black.svg";

interface CalendarTopBarProps {
    monthLabel: string;
    year: number;
    viewMode: CalendarViewMode;
    onStatsClick?: () => void;
}

export function CalendarTopBar({
    monthLabel,
    year,
    viewMode,
    onStatsClick,
}: CalendarTopBarProps) {
    const isStatsActive = viewMode === "stats";

    return (
        <div id="calendar-header">
            <TopBarShell>
                <div className="flex h-full w-full items-center justify-between">
                    <h1 className="flex items-baseline gap-2">
                        <span className="text-[32px] font-bold leading-[150%] tracking-[-0.64px] text-black-100">
                            {monthLabel}
                        </span>
                        <span
                            className="text-[16px] font-semibold"
                            style={{
                                fontFamily: "Pretendard",
                                color: "var(--black-700, #505357)",
                                lineHeight: "150%",
                                letterSpacing: "-0.24px",
                            }}
                        >
                            {year}
                        </span>
                    </h1>

                    <TopBarIconButton
                        aria-label="통계 보기"
                        onClick={onStatsClick}
                        className={
                            isStatsActive ? "!bg-black-400" : "!bg-black-800"
                        }
                    >
                        <img
                            src={isStatsActive ? statsIconBlack : statsIconGrey}
                            alt=""
                            className="h-5 w-5"
                        />
                    </TopBarIconButton>
                </div>
            </TopBarShell>
        </div>
    );
}

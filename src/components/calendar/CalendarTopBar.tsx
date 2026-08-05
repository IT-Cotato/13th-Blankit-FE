import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

function StatsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
            aria-hidden="true"
        >
            <path d="M10 4h4M12 2v4" strokeLinecap="round" />
            <path d="M5 7h14" strokeLinecap="round" />
            <path d="M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        </svg>
    );
}

interface CalendarTopBarProps {
    monthLabel: string;
    year: number;
    onStatsClick?: () => void;
}

export function CalendarTopBar({
    monthLabel,
    year,
    onStatsClick,
}: CalendarTopBarProps) {
    return (
        <TopBarShell id="calendar-header">
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

                <TopBarIconButton aria-label="통계 보기" onClick={onStatsClick}>
                    <StatsIcon />
                </TopBarIconButton>
            </div>
        </TopBarShell>
    );
}

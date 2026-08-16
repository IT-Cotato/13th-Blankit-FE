import { CalendarFillIndicator } from "@/components/calendar/CalendarFillIndicator";

interface CalendarDateBadgeProps {
    date: string | null;
    actualMinutes: number;
    recommendedMinutes: number;
}

const formatDisplayDate = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return date;
    const day = parsedDate.getDate();
    const weekday = parsedDate.toLocaleDateString("ko-KR", { weekday: "long" });
    return `${parsedDate.getMonth() + 1}월 ${day}일 ${weekday}`;
};

export const CalendarDateBadge = ({
    date,
    actualMinutes,
    recommendedMinutes,
}: CalendarDateBadgeProps) => {
    return (
        <div className="flex select-none items-center gap-2 rounded-xl bg-black-800 px-3 py-2 [-webkit-user-select:none]">
            <CalendarFillIndicator
                actualMinutes={actualMinutes}
                recommendedMinutes={recommendedMinutes}
                fillOpacity="full"
                emptyVariant="outline"
                showPartialFillBorder
                className="h-[25px] w-[25px] flex-shrink-0 rounded-[4px]"
            />
            <span
                className="text-[14px] font-medium text-black-100"
                style={{
                    fontFamily: "Pretendard",
                    lineHeight: "150%",
                    letterSpacing: "-0.21px",
                }}
            >
                {formatDisplayDate(date)}
            </span>
        </div>
    );
};

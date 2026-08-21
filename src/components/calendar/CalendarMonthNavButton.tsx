import LeftAngleBracketsIcon from "@/assets/icons/calendar/left-angle-brackets.svg";
import RightAngleBracketsIcon from "@/assets/icons/calendar/right-angle-brackets.svg";

interface CalendarMonthNavButtonProps {
    direction: "prev" | "next";
    visible: boolean;
    onClick: () => void;
}

export const CalendarMonthNavButton = ({
    direction,
    visible,
    onClick,
}: CalendarMonthNavButtonProps) => {
    const isPrev = direction === "prev";

    return (
        <button
            type="button"
            aria-label={isPrev ? "이전 달로 이동" : "다음 달로 이동"}
            onClick={(event) => {
                event.stopPropagation();
                onClick();
            }}
            className={`absolute top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-black-800 ${
                isPrev ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
            } ${
                visible
                    ? "opacity-100"
                    : "pointer-events-none opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100"
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        >
            <img
                src={isPrev ? LeftAngleBracketsIcon : RightAngleBracketsIcon}
                width={7}
                height={12}
                alt=""
                aria-hidden="true"
            />
        </button>
    );
};

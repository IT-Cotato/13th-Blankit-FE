import { useRef, useState } from "react";

import {
    useTimeTableStore,
    type TimeTableEntry,
} from "@/store/useTimeTableStore";

type DraftEntry = Omit<TimeTableEntry, "id">;
type PickerStep = "day" | "time";

type TimeTableTimeWheelProps = {
    onCancel: () => void;
    onComplete: (entry: DraftEntry) => void;
    mode?: "add" | "edit-day" | "edit-time";
    initialEntry?: DraftEntry;
};

const DAYS = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
];
const MINUTES = Array.from({ length: 12 }, (_, index) =>
    String(index * 5).padStart(2, "0"),
);
const LAST_PICKER_HOUR = 23;
const LAST_SELECTABLE_MINUTES = 23 * 60 + 55;
const ITEM_HEIGHT = 32;

type WheelColumnProps = {
    options: string[];
    value: number;
    onChange: (index: number) => void;
    className?: string;
    circular?: boolean;
};

function WheelColumn({
    options,
    value,
    onChange,
    className = "",
    circular = false,
}: WheelColumnProps) {
    const wheelRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);
    const middleSetStart = options.length * 2;
    const displayedOptions = circular
        ? Array.from({ length: options.length * 5 }, (_, index) => ({
              label: options[index % options.length],
              optionIndex: index % options.length,
          }))
        : options.map((label, index) => ({ label, optionIndex: index }));
    const [activeDisplayIndex, setActiveDisplayIndex] = useState(
        circular ? middleSetStart + value : value,
    );

    return (
        <div
            ref={(node) => {
                wheelRef.current = node;
                if (node && !initializedRef.current) {
                    const initialIndex = circular
                        ? middleSetStart + value
                        : value;
                    node.style.scrollBehavior = "auto";
                    node.scrollTop = initialIndex * ITEM_HEIGHT;
                    setActiveDisplayIndex(initialIndex);
                    initializedRef.current = true;
                    requestAnimationFrame(() => {
                        node.style.scrollBehavior = "smooth";
                    });
                }
            }}
            className={`h-40 snap-y snap-mandatory scroll-smooth overflow-y-auto py-16 [perspective:220px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
            onScroll={(event) => {
                const displayIndex = Math.min(
                    displayedOptions.length - 1,
                    Math.max(
                        0,
                        Math.round(event.currentTarget.scrollTop / ITEM_HEIGHT),
                    ),
                );
                setActiveDisplayIndex(displayIndex);
                const optionIndex = displayedOptions[displayIndex].optionIndex;
                if (optionIndex !== value) onChange(optionIndex);

                if (
                    circular &&
                    (displayIndex < options.length ||
                        displayIndex >= options.length * 4)
                ) {
                    const centeredIndex = middleSetStart + optionIndex;
                    requestAnimationFrame(() => {
                        if (wheelRef.current) {
                            wheelRef.current.scrollTop =
                                centeredIndex * ITEM_HEIGHT;
                            setActiveDisplayIndex(centeredIndex);
                        }
                    });
                }
            }}
        >
            {displayedOptions.map(({ label }, index) => (
                <button
                    key={`${label}-${index}`}
                    type="button"
                    onClick={() =>
                        wheelRef.current?.scrollTo({
                            top: index * ITEM_HEIGHT,
                            behavior: "smooth",
                        })
                    }
                    className={`flex h-8 w-full snap-center items-center justify-center text-lg font-medium tracking-[-0.27px] ${
                        index === activeDisplayIndex
                            ? "text-black-100"
                            : "text-black-700"
                    }`}
                    style={{
                        opacity: Math.max(
                            0.18,
                            1 - Math.abs(index - activeDisplayIndex) * 0.28,
                        ),
                        transform: `rotateX(${(index - activeDisplayIndex) * -18}deg) scale(${Math.max(
                            0.72,
                            1 - Math.abs(index - activeDisplayIndex) * 0.08,
                        )})`,
                        transformOrigin: "center",
                        transition:
                            "transform 140ms ease, opacity 140ms ease, color 140ms ease",
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export function TimeTableTimeWheel({
    onCancel,
    onComplete,
    mode = "add",
    initialEntry,
}: TimeTableTimeWheelProps) {
    const startHour = useTimeTableStore((state) => state.startHour);
    const maxSelectableMinutes = LAST_SELECTABLE_MINUTES;
    const hours = Array.from(
        { length: Math.max(1, LAST_PICKER_HOUR - startHour + 1) },
        (_, index) => index + startHour,
    ).filter((hour) => hour <= LAST_PICKER_HOUR);
    const initialStartMinutes = Math.min(
        startHour * 60 + (initialEntry?.startSlot ?? 0) * 5,
        maxSelectableMinutes,
    );
    const initialEndMinutes = Math.min(
        startHour * 60 + ((initialEntry?.endSlot ?? 11) + 1) * 5,
        maxSelectableMinutes,
    );
    const [step, setStep] = useState<PickerStep>(
        mode === "edit-time" ? "time" : "day",
    );
    const [dayIndex, setDayIndex] = useState(initialEntry?.dayIndex ?? 1);
    const [startHourIndex, setStartHourIndex] = useState(
        Math.max(
            0,
            Math.min(
                hours.length - 1,
                Math.floor(initialStartMinutes / 60) - startHour,
            ),
        ),
    );
    const [startMinuteIndex, setStartMinuteIndex] = useState(
        Math.floor((initialStartMinutes % 60) / 5),
    );
    const [endHourIndex, setEndHourIndex] = useState(
        Math.max(
            0,
            Math.min(
                hours.length - 1,
                Math.floor(initialEndMinutes / 60) - startHour,
            ),
        ),
    );
    const [endMinuteIndex, setEndMinuteIndex] = useState(
        Math.floor((initialEndMinutes % 60) / 5),
    );
    const selectedEndHour = hours[endHourIndex];

    const handleComplete = () => {
        if (step === "day") {
            if (mode === "edit-day" && initialEntry) {
                onComplete({ ...initialEntry, dayIndex });
                return;
            }
            setStep("time");
            return;
        }

        const startMinutes =
            hours[startHourIndex] * 60 + Number(MINUTES[startMinuteIndex]);
        const endMinutes =
            selectedEndHour * 60 + Number(MINUTES[endMinuteIndex]);
        const safeEndMinutes = Math.min(
            maxSelectableMinutes,
            Math.max(startMinutes + 30, endMinutes),
        );

        onComplete({
            ...initialEntry,
            dayIndex,
            startSlot: Math.max(
                0,
                Math.round((startMinutes - startHour * 60) / 5),
            ),
            endSlot: Math.min(
                Math.floor((maxSelectableMinutes - startHour * 60) / 5) - 1,
                Math.round((safeEndMinutes - startHour * 60) / 5) - 1,
            ),
        });
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60">
            <section
                className="flex w-full sm:max-w-[375px] flex-col items-start gap-5 rounded-t-xl bg-black-850 px-5 pb-5 pt-[21px]"
                style={{ height: "34.4dvh" }}
            >
                <div className="flex h-6 w-full shrink-0 items-center justify-between">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-center text-base font-medium leading-[150%] tracking-[-0.24px] text-black-100"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={handleComplete}
                        className="text-center text-base font-medium leading-[150%] tracking-[-0.24px] text-black-100"
                    >
                        완료
                    </button>
                </div>

                <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
                    {step === "day" ? (
                        <>
                            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-8 -translate-y-1/2 rounded-md bg-black-800" />
                            <WheelColumn
                                options={DAYS}
                                value={dayIndex}
                                onChange={setDayIndex}
                                className="relative z-10 w-full"
                            />
                        </>
                    ) : (
                        <div className="relative z-10 flex h-40 w-full items-center justify-center gap-3">
                            <div className="relative flex h-40 min-w-0 flex-1">
                                <div className="pointer-events-none absolute right-[-0.5px] top-1/2 z-0 h-[30px] w-[calc(100%_+_0.5px)] -translate-y-1/2 rounded-lg bg-black-800" />
                                <WheelColumn
                                    options={hours.map((hour) =>
                                        String(hour).padStart(2, "0"),
                                    )}
                                    value={startHourIndex}
                                    onChange={setStartHourIndex}
                                    className="relative z-10 w-1/2"
                                />
                                <WheelColumn
                                    options={MINUTES}
                                    value={startMinuteIndex}
                                    onChange={setStartMinuteIndex}
                                    className="relative z-10 w-1/2"
                                    circular
                                />
                            </div>
                            <div className="relative flex h-40 min-w-0 flex-1">
                                <div className="pointer-events-none absolute right-[-0.5px] top-1/2 z-0 h-[30px] w-[calc(100%_+_0.5px)] -translate-y-1/2 rounded-lg bg-black-800" />
                                <WheelColumn
                                    options={hours.map((hour) =>
                                        String(hour).padStart(2, "0"),
                                    )}
                                    value={endHourIndex}
                                    onChange={setEndHourIndex}
                                    className="relative z-10 w-1/2"
                                />
                                <WheelColumn
                                    options={MINUTES}
                                    value={endMinuteIndex}
                                    onChange={setEndMinuteIndex}
                                    className="relative z-10 w-1/2"
                                    circular
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

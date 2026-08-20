import { useState } from "react";

import { TimeTableColorPicker } from "@/components/mypage/timetable/TimeTableColorPicker";
import { TimeTableOverlapModal } from "@/components/mypage/timetable/TimeTableOverlapModal";
import { TimeTableTimeWheel } from "@/components/mypage/timetable/TimeTableTimeWheel";
import {
    useTimeTableStore,
    type TimeTableEntry,
} from "@/store/useTimeTableStore";

type DraftEntry = Omit<TimeTableEntry, "id">;
type WheelRequest = {
    mode: "add" | "edit-day" | "edit-time";
    index?: number;
    entry?: DraftEntry;
};

type TimeTableEntrySheetProps = {
    entries: DraftEntry[];
    conflictEntries?: DraftEntry[];
    onEntriesChange: (entries: DraftEntry[]) => void;
    onClose: () => void;
    onComplete: (details: {
        title: string;
        place: string;
        color: string;
    }) => void;
    initialDetails?: {
        title: string;
        place: string;
        color: string;
    };
};

const DAY_LABELS = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
];
function entriesOverlap(first: DraftEntry, second: DraftEntry) {
    return (
        first.dayIndex === second.dayIndex &&
        first.startSlot <= second.endSlot &&
        first.endSlot >= second.startSlot
    );
}

function formatSlot(slot: number, startHour: number) {
    const totalMinutes = startHour * 60 + slot * 5;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function TimeTableEntrySheet({
    entries,
    conflictEntries = [],
    onEntriesChange,
    onClose,
    onComplete,
    initialDetails,
}: TimeTableEntrySheetProps) {
    const startHour = useTimeTableStore((state) => state.startHour);
    const [title, setTitle] = useState(initialDetails?.title ?? "");
    const [place, setPlace] = useState(initialDetails?.place ?? "");
    const [selectedColor, setSelectedColor] = useState(
        initialDetails?.color ?? "#5BE478",
    );
    const [wheelRequest, setWheelRequest] = useState<WheelRequest | null>(null);
    const [overlapOrigin, setOverlapOrigin] = useState<
        "entries" | "wheel" | null
    >(null);

    return (
        <div
            className="fixed sm:max-w-[641px] mx-auto inset-0 z-[100] flex items-end justify-center bg-black/60"
            onPointerDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            {!wheelRequest && (
                <section
                    aria-label="시간표 등록"
                    className="flex w-full flex-col items-center gap-5 rounded-t-xl bg-black-850 px-5 pb-5 pt-[21px] shadow-[0_-10px_60px_rgba(0,0,0,0.6)]"
                    style={{
                        minHeight: "clamp(420px, 62dvh, 505px)",
                    }}
                >
                    <div className="relative flex h-6 w-full items-center">
                        <h2 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-base font-medium leading-6 tracking-[-0.24px] text-black-100">
                            시간표 등록
                        </h2>
                        <button
                            type="button"
                            aria-label="시간표 등록 닫기"
                            onClick={onClose}
                            className="absolute right-0 top-0 grid h-6 w-6 place-items-center"
                        >
                            <img
                                src="/mypage/X.svg"
                                alt=""
                                aria-hidden="true"
                                className="h-3 w-3 object-contain"
                            />
                        </button>
                    </div>

                    <div className="flex min-h-0 w-full flex-1 flex-col gap-5">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="제목(필수 입력)"
                            className="h-[42px] w-full self-stretch rounded-md border-0 bg-black-800 px-3 py-1 text-left text-base font-medium leading-[150%] tracking-[-0.21px] text-black-100 outline-none placeholder:text-black-600"
                        />
                        <input
                            value={place}
                            onChange={(event) => setPlace(event.target.value)}
                            placeholder="장소(선택 입력)"
                            className="h-[42px] w-full rounded-md border-0 bg-black-800 px-3 text-base font-medium tracking-[-0.21px] text-black-100 outline-none placeholder:text-black-600"
                        />

                        <TimeTableColorPicker
                            value={selectedColor}
                            onChange={setSelectedColor}
                        />

                        <div className="flex min-h-[151px] w-full shrink-0 self-stretch flex-col items-center justify-start gap-2 rounded-lg bg-black-800 px-3 py-2.5">
                            {entries.map((entry, index) => (
                                <div
                                    key={`${entry.dayIndex}-${entry.startSlot}-${entry.endSlot}-${index}`}
                                    className="flex h-[29px] w-full items-center gap-2"
                                >
                                    <button
                                        type="button"
                                        aria-label={`${index + 1}번째 요일`}
                                        onClick={() =>
                                            setWheelRequest({
                                                mode: "edit-day",
                                                index,
                                                entry,
                                            })
                                        }
                                        className="flex h-[29px] w-[84px] shrink-0 items-center justify-between rounded-md bg-black-750/50 px-3 py-1 text-left text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
                                    >
                                        <span>
                                            {DAY_LABELS[entry.dayIndex]}
                                        </span>
                                        <img
                                            src="/mypage/wheel.svg"
                                            alt=""
                                            aria-hidden="true"
                                            className="h-[11.454px] w-[7px] shrink-0 [aspect-ratio:11/18]"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setWheelRequest({
                                                mode: "edit-time",
                                                index,
                                                entry,
                                            })
                                        }
                                        className="flex h-[29px] w-[144.454px] shrink-0 items-center justify-between gap-3 rounded-md bg-black-750/50 px-3 py-1 text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
                                    >
                                        <span className="flex items-center">
                                            <span>
                                                {formatSlot(
                                                    entry.startSlot,
                                                    startHour,
                                                )}
                                            </span>
                                            <img
                                                src="/mypage/Rectangle.svg"
                                                alt="부터"
                                                className="mx-2 h-0.5 w-2 shrink-0"
                                            />
                                            <span>
                                                {formatSlot(
                                                    entry.endSlot + 1,
                                                    startHour,
                                                )}
                                            </span>
                                        </span>
                                        <img
                                            src="/mypage/wheel.svg"
                                            alt=""
                                            aria-hidden="true"
                                            className="h-[11.454px] w-[7px] shrink-0 [aspect-ratio:11/18]"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        aria-label={`${DAY_LABELS[entry.dayIndex]} 시간 삭제`}
                                        onClick={() =>
                                            onEntriesChange(
                                                entries.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index,
                                                ),
                                            )
                                        }
                                        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center gap-2.5 px-[3px] py-0.5"
                                    >
                                        <img
                                            src="/mypage/X.svg"
                                            alt=""
                                            aria-hidden="true"
                                            className="h-3 w-3"
                                        />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => setWheelRequest({ mode: "add" })}
                                className="mx-auto mt-auto flex h-[33px] w-[121px] items-center justify-center gap-2 rounded-md bg-black-750 px-3 py-1.5 text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
                            >
                                <img
                                    src="/mypage/plus.svg"
                                    alt=""
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 shrink-0"
                                />
                                시간 추가하기
                            </button>
                        </div>

                        <button
                            type="button"
                            disabled={!title.trim() || entries.length === 0}
                            onClick={() => {
                                const hasOverlap = entries.some((entry) =>
                                    conflictEntries.some((existingEntry) =>
                                        entriesOverlap(existingEntry, entry),
                                    ),
                                );

                                if (hasOverlap) {
                                    setOverlapOrigin("entries");
                                    return;
                                }

                                onComplete({
                                    title: title.trim(),
                                    place: place.trim(),
                                    color: selectedColor,
                                });
                            }}
                            className="mt-auto flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-black-800 text-sm font-semibold tracking-[-0.21px] text-black-600 enabled:bg-green-500 enabled:text-black-900"
                        >
                            완료
                        </button>
                    </div>
                </section>
            )}

            {wheelRequest && (
                <TimeTableTimeWheel
                    mode={wheelRequest.mode}
                    initialEntry={wheelRequest.entry}
                    onCancel={() => setWheelRequest(null)}
                    onComplete={(entry) => {
                        const hasDraftOverlap = entries.some(
                            (existingEntry, index) => {
                                if (index === wheelRequest.index) return false;
                                return entriesOverlap(existingEntry, entry);
                            },
                        );
                        const hasSavedOverlap = conflictEntries.some(
                            (existingEntry) =>
                                entriesOverlap(existingEntry, entry),
                        );

                        if (hasDraftOverlap || hasSavedOverlap) {
                            setOverlapOrigin("wheel");
                            return;
                        }

                        if (wheelRequest.index === undefined) {
                            onEntriesChange([...entries, entry]);
                        } else {
                            onEntriesChange(
                                entries.map((item, index) =>
                                    index === wheelRequest.index ? entry : item,
                                ),
                            );
                        }
                        setWheelRequest(null);
                    }}
                />
            )}

            {overlapOrigin && (
                <TimeTableOverlapModal
                    onConfirm={() => {
                        if (overlapOrigin === "entries") {
                            onEntriesChange(
                                entries.filter(
                                    (entry) =>
                                        !conflictEntries.some((existingEntry) =>
                                            entriesOverlap(
                                                existingEntry,
                                                entry,
                                            ),
                                        ),
                                ),
                            );
                        } else {
                            setWheelRequest(null);
                        }
                        setOverlapOrigin(null);
                    }}
                />
            )}
        </div>
    );
}

import { useMemo, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PlaylistTaskCard } from "@/components/task-playlist/PlaylistTaskCard";
import {
    ACTIVE_FILTER_CLASS_NAMES,
    PLAYLIST_FILTERS,
} from "@/components/task-playlist/playlistBottomSheetModes";
import { usePlaylistDelete } from "@/hooks/usePlaylistDelete";
import { usePlaylistReorder } from "@/hooks/usePlaylistReorder";
import { usePlaylistStore } from "@/store/usePlaylistStore";

import type { PlaylistFilter } from "@/components/task-playlist/playlistBottomSheetModes";
import type {
    CombinationModeId,
    TaskCombination,
} from "@/types/taskCombination";

interface PlaylistBottomSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onShowToast: (message: string) => void;
    onBeforeCurrentTaskChange: () => Promise<boolean>;
    hiddenDuplicateModeIds?: CombinationModeId[];
    modeCombinations?: TaskCombination[];
}

export function PlaylistBottomSheet({
    open,
    onOpenChange,
    onShowToast,
    onBeforeCurrentTaskChange,
    hiddenDuplicateModeIds = [],
    modeCombinations = [],
}: PlaylistBottomSheetProps) {
    const playlist = usePlaylistStore((state) => state.playlist);
    const selectTask = usePlaylistStore((state) => state.selectTask);

    const [filter, setFilter] = useState<PlaylistFilter>("all");
    const [deletingSelectedTasks, setDeletingSelectedTasks] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);
    const [switchingCurrentTask, setSwitchingCurrentTask] = useState(false);

    const sheetDragStartYRef = useRef<number | null>(null);
    const ignoreNextClickRef = useRef(false);

    const filteredTasks = useMemo(() => {
        if (filter === "all") {
            return playlist;
        }

        if (hiddenDuplicateModeIds.includes(filter)) {
            return [];
        }

        const selectedMode = modeCombinations.find(
            (combination) => combination.id === filter,
        );

        if (!selectedMode) {
            return [];
        }

        const modeTaskIds = new Set(
            selectedMode.tasks.map((task) => task.taskId),
        );

        return playlist.filter(
            (task) => task.taskId !== undefined && modeTaskIds.has(task.taskId),
        );
    }, [filter, hiddenDuplicateModeIds, modeCombinations, playlist]);

    const {
        validSelectedTaskIds,
        showDeleteSelectedDialog,
        playlistMutationInProgress,
        setShowDeleteSelectedDialog,
        toggleTask,
        selectAll,
        resetSelection,
        deleteSelected,
    } = usePlaylistDelete({
        playlist,
        savingOrder,
        deletingSelectedTasks,
        setDeletingSelectedTasks,
        onShowToast,
        onBeforeCurrentTaskChange,
    });

    const playlistInteractionInProgress =
        playlistMutationInProgress || switchingCurrentTask;

    const {
        sensors,
        draggingDisabled,
        handleDragStart,
        handleDragCancel,
        handleDragEnd,
        consumeIgnoredTaskClick,
    } = usePlaylistReorder({
        playlist,
        draggingAllowed: filter === "all",
        deletingSelectedTasks,
        showDeleteSelectedDialog,
        savingOrder,
        setSavingOrder,
        onShowToast,
    });

    const handleFilterChange = (nextFilter: PlaylistFilter) => {
        setFilter(nextFilter);
        resetSelection();
    };

    const handleSelectTask = async (taskId: string) => {
        const ignoredTaskClick = consumeIgnoredTaskClick();

        if (playlistInteractionInProgress || ignoredTaskClick) {
            return;
        }

        if (playlist[0]?.id !== taskId) {
            setSwitchingCurrentTask(true);

            try {
                const paused = await onBeforeCurrentTaskChange();

                if (!paused) {
                    return;
                }
            } finally {
                setSwitchingCurrentTask(false);
            }
        }

        selectTask(taskId);
        resetSelection();
        onOpenChange(false);
    };

    const handleSheetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const shouldIgnoreClick =
            ignoreNextClickRef.current && event.detail > 0;

        ignoreNextClickRef.current = false;

        if (shouldIgnoreClick) {
            return;
        }

        onOpenChange(!open);
    };

    const handleSheetPointerDown = (
        event: React.PointerEvent<HTMLButtonElement>,
    ) => {
        ignoreNextClickRef.current = false;
        sheetDragStartYRef.current = event.clientY;

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleSheetPointerUp = (
        event: React.PointerEvent<HTMLButtonElement>,
    ) => {
        if (sheetDragStartYRef.current === null) {
            return;
        }

        const distance = event.clientY - sheetDragStartYRef.current;

        sheetDragStartYRef.current = null;

        if (Math.abs(distance) < 10) {
            return;
        }

        ignoreNextClickRef.current = true;

        if (distance < -30) {
            onOpenChange(true);
        } else if (distance > 30) {
            onOpenChange(false);
        }
    };

    const handleSheetPointerCancel = () => {
        sheetDragStartYRef.current = null;
        ignoreNextClickRef.current = false;
    };

    const selectedModeName =
        PLAYLIST_FILTERS.find((playlistFilter) => playlistFilter.id === filter)
            ?.label ?? "";

    const allFilteredTasksSelected =
        filteredTasks.length > 0 &&
        filteredTasks.every((task) => validSelectedTaskIds.has(task.id));

    return (
        <>
            <section
                aria-label="과업 플레이리스트"
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
                onPointerUp={(event) => {
                    event.stopPropagation();
                }}
                onPointerCancel={(event) => {
                    event.stopPropagation();
                }}
                className={`fixed sm:max-w-[641px] mx-auto bottom-[90px] left-0 right-0 z-40 rounded-t-[16px] bg-black-850 transition-[height] duration-300 ${
                    open ? "h-[calc(100dvh-154px)]" : "h-[72px]"
                }`}
            >
                <button
                    type="button"
                    aria-expanded={open}
                    aria-label={
                        open ? "플레이리스트 접기" : "플레이리스트 펼치기"
                    }
                    onClick={handleSheetClick}
                    onPointerDown={handleSheetPointerDown}
                    onPointerUp={handleSheetPointerUp}
                    onPointerCancel={handleSheetPointerCancel}
                    className="flex h-[34px] w-full touch-none items-center justify-center"
                >
                    <span
                        aria-hidden="true"
                        className="h-1 w-12 rounded-full bg-black-650"
                    />
                </button>

                {open && (
                    <div className="flex h-[calc(100%-34px)] flex-col px-5 pb-5">
                        <div className="flex shrink-0 gap-2 overflow-x-auto pb-3">
                            {PLAYLIST_FILTERS.map((item) => {
                                const active = filter === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        disabled={playlistInteractionInProgress}
                                        aria-pressed={active}
                                        onClick={() =>
                                            handleFilterChange(item.id)
                                        }
                                        className={`shrink-0 rounded-[6px] px-2.5 py-1.5 text-[14px] font-semibold ${
                                            active
                                                ? ACTIVE_FILTER_CLASS_NAMES[
                                                      item.id
                                                  ]
                                                : "bg-black-750/50 text-black-500"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex shrink-0 items-center justify-between py-2">
                            <p className="text-[16px] font-semibold text-black-100">
                                과업 {filteredTasks.length}개
                            </p>

                            {validSelectedTaskIds.size > 0 ? (
                                <button
                                    type="button"
                                    disabled={playlistInteractionInProgress}
                                    onClick={() =>
                                        setShowDeleteSelectedDialog(true)
                                    }
                                    className="rounded-[6px] bg-green-500 px-2.5 py-1.5 text-[14px] font-semibold text-black-900 disabled:opacity-50"
                                >
                                    {allFilteredTasksSelected
                                        ? "전체 삭제"
                                        : `${validSelectedTaskIds.size}개 삭제`}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => selectAll(filteredTasks)}
                                    disabled={
                                        filteredTasks.length === 0 ||
                                        playlistInteractionInProgress
                                    }
                                    className="rounded-[6px] bg-black-800 px-2.5 py-1.5 text-[14px] font-medium text-black-900 disabled:opacity-40"
                                >
                                    전체 선택
                                </button>
                            )}
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto pt-2">
                            {filteredTasks.length > 0 ? (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragCancel={handleDragCancel}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={filteredTasks.map(
                                            (task) => task.id,
                                        )}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <ul className="flex flex-col gap-3">
                                            {filteredTasks.map((task) => (
                                                <PlaylistTaskCard
                                                    key={task.id}
                                                    task={task}
                                                    selected={validSelectedTaskIds.has(
                                                        task.id,
                                                    )}
                                                    draggingDisabled={
                                                        draggingDisabled
                                                    }
                                                    interactionDisabled={
                                                        playlistInteractionInProgress
                                                    }
                                                    onSelectTask={() => {
                                                        void handleSelectTask(
                                                            task.id,
                                                        );
                                                    }}
                                                    onToggle={() =>
                                                        toggleTask(task.id)
                                                    }
                                                />
                                            ))}
                                        </ul>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="flex h-full items-center justify-center px-5 text-center">
                                    <p className="text-[14px] font-semibold text-black-100">
                                        {filter === "all"
                                            ? "재생 목록이 없습니다."
                                            : `${selectedModeName}에 해당하는 과업이 없습니다.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <ConfirmModal
                open={showDeleteSelectedDialog}
                title="과업을 진짜 삭제하시겠습니까?"
                confirmLabel="확인"
                submitting={deletingSelectedTasks}
                onCancel={() => {
                    if (!deletingSelectedTasks) {
                        setShowDeleteSelectedDialog(false);
                    }
                }}
                onConfirm={deleteSelected}
            />
        </>
    );
}

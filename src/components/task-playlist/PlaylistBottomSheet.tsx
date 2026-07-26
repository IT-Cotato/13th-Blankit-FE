import { useMemo, useRef, useState } from "react";

import { ConfirmationDialog } from "@/components/task-combination/ConfirmationDialog";
import { taskCombinations } from "@/mocks/taskCombinations";
import { usePlaylistStore } from "@/store/usePlaylistStore";

import type {
  CombinationModeId,
  PlaylistTask,
} from "@/types/taskCombination";

interface PlaylistBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PlaylistFilter = "all" | CombinationModeId;

const FILTERS: Array<{
  id: PlaylistFilter;
  label: string;
}> = [
  { id: "all", label: "전체" },
  ...taskCombinations.map((combination) => ({
    id: combination.id,
    label: combination.name.replace(" 모드", ""),
  })),
];

const ACTIVE_FILTER_CLASS_NAMES: Record<
  PlaylistFilter,
  string
> = {
  all: "bg-black-200 text-black-900",
  fire: "bg-red-500 text-black-900",
  balance: "bg-green-500 text-black-900",
  "quick-try": "bg-purple-500 text-black-900",
  "get-it-done": "bg-[#FBF965] text-black-900",
};

function PlaylistTaskRow({
  task,
  selected,
  onToggle,
  onDragStart,
  onDragMove,
  onDragEnd,
}: {
  task: PlaylistTask;
  selected: boolean;
  onToggle: () => void;
  onDragStart: (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void;
  onDragMove: (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void;
  onDragEnd: (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void;
}) {
  return (
    <li
      data-playlist-task-id={task.id}
      className="flex items-center gap-3 rounded-[10px] bg-black-800 px-3 py-3"
    >
      <button
        type="button"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        aria-label={`${task.title} 순서 변경`}
        className="flex h-9 w-9 touch-none items-center justify-center rounded-full bg-black-850 active:cursor-grabbing"
      >
        <img
          src={task.categoryIcon}
          alt=""
          className="h-5 w-5"
        />
      </button>

      <button
        type="button"
        onClick={onToggle}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block truncate text-[13px] font-semibold text-black-200">
          {task.title}
        </span>
        {task.lastMemo && (
          <span className="mt-1 block truncate text-[10px] font-medium text-black-600">
            {task.lastMemo}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          selected
            ? `${task.title} 선택 해제`
            : `${task.title} 선택`
        }
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          selected
            ? "border-green-500 bg-green-500 text-black-900"
            : "border-black-650"
        }`}
      >
        {selected && (
          <span
            aria-hidden="true"
            className="text-[13px] font-bold"
          >
            ✓
          </span>
        )}
      </button>
    </li>
  );
}

export function PlaylistBottomSheet({
  open,
  onOpenChange,
}: PlaylistBottomSheetProps) {
  const playlist = usePlaylistStore(
    (state) => state.playlist,
  );
  const removeTasks = usePlaylistStore(
    (state) => state.removeTasks,
  );
  const clearPlaylist = usePlaylistStore(
    (state) => state.clearPlaylist,
  );
  const reorderTask = usePlaylistStore(
    (state) => state.reorderTask,
  );
  const [filter, setFilter] =
    useState<PlaylistFilter>("all");
  const [selectedTaskIds, setSelectedTaskIds] = useState<
    Set<string>
  >(new Set());
  const [showDeleteAllDialog, setShowDeleteAllDialog] =
    useState(false);
  const sheetDragStartYRef = useRef<number | null>(null);
  const draggedTaskIdRef = useRef<string | null>(null);

  const filteredTasks = useMemo(
    () =>
      filter === "all"
        ? playlist
        : playlist.filter(
            (task) => task.sourceModeId === filter,
          ),
    [filter, playlist],
  );

  const validSelectedTaskIds = useMemo(() => {
    const playlistTaskIds = new Set(
      playlist.map((task) => task.id),
    );

    return new Set(
      [...selectedTaskIds].filter((id) =>
        playlistTaskIds.has(id),
      ),
    );
  }, [playlist, selectedTaskIds]);

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((current) => {
      const next = new Set(current);

      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }

      return next;
    });
  };

  const handleDeleteSelected = () => {
    removeTasks([...validSelectedTaskIds]);
    setSelectedTaskIds(new Set());
  };

  const handleSheetPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    sheetDragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSheetPointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (sheetDragStartYRef.current === null) {
      return;
    }

    const distance =
      event.clientY - sheetDragStartYRef.current;
    sheetDragStartYRef.current = null;

    if (Math.abs(distance) < 10) {
      onOpenChange(!open);
    } else if (distance < -30) {
      onOpenChange(true);
    } else if (distance > 30) {
      onOpenChange(false);
    }
  };

  const handleTaskDragStart = (
    taskId: string,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    draggedTaskIdRef.current = taskId;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTaskDragMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const activeTaskId = draggedTaskIdRef.current;

    if (!activeTaskId) {
      return;
    }

    const elementAtPointer = document.elementFromPoint(
      event.clientX,
      event.clientY,
    );
    const overTaskId = elementAtPointer
      ?.closest<HTMLElement>("[data-playlist-task-id]")
      ?.dataset.playlistTaskId;

    if (overTaskId && overTaskId !== activeTaskId) {
      reorderTask(activeTaskId, overTaskId);
    }
  };

  const handleTaskDragEnd = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    draggedTaskIdRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }
  };

  const selectedModeName =
    taskCombinations.find(
      (combination) => combination.id === filter,
    )?.name ?? "";

  return (
    <>
      <section
        aria-label="과업 플레이리스트"
        className={`fixed left-0 right-0 z-40 rounded-t-[16px] bg-black-850 transition-[top,height] duration-300 ${
          open
            ? "bottom-[90px] top-[64px]"
            : "bottom-[90px] h-[72px]"
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={
            open
              ? "플레이리스트 접기"
              : "플레이리스트 펼치기"
          }
          onPointerDown={handleSheetPointerDown}
          onPointerUp={handleSheetPointerUp}
          onPointerCancel={() => {
            sheetDragStartYRef.current = null;
          }}
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
              {FILTERS.map((item) => {
                const active = filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`shrink-0 rounded-[6px] px-3 py-2 text-[11px] font-semibold ${
                      active
                        ? ACTIVE_FILTER_CLASS_NAMES[
                            item.id
                          ]
                        : "bg-black-800 text-black-500"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center justify-between py-2">
              <p className="text-[12px] font-semibold text-black-300">
                과업 {filteredTasks.length}개
              </p>

              {validSelectedTaskIds.size > 0 ? (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="rounded-[6px] bg-green-500 px-3 py-1.5 text-[11px] font-semibold text-black-900"
                >
                  {validSelectedTaskIds.size}개 삭제
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteAllDialog(true)
                  }
                  disabled={playlist.length === 0}
                  className="rounded-[6px] bg-black-800 px-3 py-1.5 text-[11px] font-semibold text-black-500 disabled:opacity-40"
                >
                  전체 삭제
                </button>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pt-2">
              {filteredTasks.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {filteredTasks.map((task) => (
                    <PlaylistTaskRow
                      key={task.id}
                      task={task}
                      selected={validSelectedTaskIds.has(
                        task.id,
                      )}
                      onToggle={() =>
                        handleToggleTask(task.id)
                      }
                      onDragStart={(event) =>
                        handleTaskDragStart(task.id, event)
                      }
                      onDragMove={handleTaskDragMove}
                      onDragEnd={handleTaskDragEnd}
                    />
                  ))}
                </ul>
              ) : (
                <div className="flex h-full items-center justify-center px-5 text-center">
                  <p className="text-[13px] font-medium text-black-500">
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

      <ConfirmationDialog
        open={showDeleteAllDialog}
        title="과업을 전부 삭제하시겠습니까?"
        onCancel={() => setShowDeleteAllDialog(false)}
        onConfirm={() => {
          clearPlaylist();
          setSelectedTaskIds(new Set());
          setShowDeleteAllDialog(false);
        }}
      />
    </>
  );
}

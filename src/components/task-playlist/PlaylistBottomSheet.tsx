import { useMemo, useRef, useState } from "react";

import { deletePlaylistItem } from "@/api/playlist";
import checkButtonGreenIcon from "@/assets/icons/task-combination/check-button-green.svg";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { usePlaylistSync } from "@/hooks/usePlaylistSync";
import { taskCombinations } from "@/mocks/taskCombinations";
import { usePlaylistStore } from "@/store/usePlaylistStore";

import type {
  CombinationModeId,
  PlaylistTask,
} from "@/types/taskCombination";

interface PlaylistBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowToast: (message: string) => void;
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
  all: "bg-green-500 text-black-900",
  fire: "bg-red-500 text-black-900",
  balance: "bg-green-600 text-black-900",
  "quick-try": "bg-purple-500 text-black-900",
  "get-it-done": "bg-[#FBF965] text-black-900",
};

interface PlaylistTaskRowProps {
  task: PlaylistTask;
  selected: boolean;
  onSelectTask: () => void;
  onToggle: () => void;
}

function PlaylistTaskRow({
  task,
  selected,
  onSelectTask,
  onToggle,
}: PlaylistTaskRowProps) {
  return (
    <li
      data-playlist-task-id={task.id}
      className="flex items-center gap-3 rounded-[10px] bg-black-800 px-3 py-3"
    >
      <button
        type="button"
        onClick={onSelectTask}
        aria-label={`${task.title} 과업 시작`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-black-850"
      >
        <img
          src={task.categoryIcon}
          alt=""
          className="h-5 w-5"
        />
      </button>

      <button
        type="button"
        onClick={onSelectTask}
        aria-label={`${task.title} 과업 시작`}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block truncate text-[13px] font-semibold text-black-200">
          {task.title}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          selected
            ? `${task.title} 선택 해제`
            : `${task.title} 선택`
        }
        className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
          selected ? "" : "border-3 border-black-700"
        }`}
      >
        {selected && (
          <img
            src={checkButtonGreenIcon}
            alt=""
            className="h-[30px] w-[30px]"
          />
        )}
      </button>
    </li>
  );
}

export function PlaylistBottomSheet({
  open,
  onOpenChange,
  onShowToast,
}: PlaylistBottomSheetProps) {
  const playlist = usePlaylistStore(
    (state) => state.playlist,
  );

  const selectTask = usePlaylistStore(
    (state) => state.selectTask,
  );

  const { refreshPlaylist } = usePlaylistSync();

  const [filter, setFilter] =
    useState<PlaylistFilter>("all");

  const [selectedTaskIds, setSelectedTaskIds] = useState<
    Set<string>
  >(new Set());

  const [
    showDeleteSelectedDialog,
    setShowDeleteSelectedDialog,
  ] = useState(false);

  const [deletingSelectedTasks, setDeletingSelectedTasks] =
    useState(false);

  const sheetDragStartYRef = useRef<number | null>(null);
  const ignoreNextClickRef = useRef(false);

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

  const handleDeleteSelected = async () => {
    if (deletingSelectedTasks) {
      return;
    }

    const selectedTasks = playlist.filter((task) =>
      validSelectedTaskIds.has(task.id),
    );

    const playlistItemIds = selectedTasks.flatMap((task) =>
      typeof task.playlistItemId === "number"
        ? [task.playlistItemId]
        : [],
    );

    if (playlistItemIds.length === 0) {
      setShowDeleteSelectedDialog(false);
      onShowToast(
        "삭제할 플레이리스트 과업을 찾지 못했습니다.",
      );
      return;
    }

    setDeletingSelectedTasks(true);

    try {
      const results = await Promise.allSettled(
        playlistItemIds.map((playlistItemId) =>
          deletePlaylistItem(playlistItemId),
        ),
      );

      await refreshPlaylist();

      setSelectedTaskIds(new Set());
      setShowDeleteSelectedDialog(false);

      const failedCount = results.filter(
        (result) => result.status === "rejected",
      ).length;

      const missingPlaylistItemIdCount =
        selectedTasks.length - playlistItemIds.length;

      if (
        failedCount > 0 ||
        missingPlaylistItemIdCount > 0
      ) {
        onShowToast(
          "일부 과업을 삭제하지 못했습니다.",
        );
        return;
      }

      onShowToast("재생 목록에서 삭제되었습니다.");
    } catch {
      onShowToast(
        "과업 플레이리스트 삭제에 실패했습니다.",
      );
    } finally {
      setDeletingSelectedTasks(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedTaskIds(
      new Set(filteredTasks.map((task) => task.id)),
    );
  };

  const handleFilterChange = (
    nextFilter: PlaylistFilter,
  ) => {
    setFilter(nextFilter);
    setSelectedTaskIds(new Set());
    setShowDeleteSelectedDialog(false);
  };

  const handleSelectTask = (taskId: string) => {
    selectTask(taskId);
    setSelectedTaskIds(new Set());
    onOpenChange(false);
  };

  const handleSheetClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
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

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
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
    taskCombinations.find(
      (combination) => combination.id === filter,
    )?.name ?? "";

  const allFilteredTasksSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((task) =>
      validSelectedTaskIds.has(task.id),
    );

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
        className={`fixed bottom-[90px] left-0 right-0 z-40 rounded-t-[16px] bg-black-850 transition-[height] duration-300 ${
          open
            ? "h-[calc(100dvh-154px)]"
            : "h-[72px]"
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
              {FILTERS.map((item) => {
                const active = filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
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
                  disabled={deletingSelectedTasks}
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
                  onClick={handleSelectAll}
                  disabled={filteredTasks.length === 0}
                  className="rounded-[6px] bg-black-800 px-2.5 py-1.5 text-[14px] font-medium text-black-900 disabled:opacity-40"
                >
                  전체 선택
                </button>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pt-2">
              {filteredTasks.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {filteredTasks.map((task) => (
                    <PlaylistTaskRow
                      key={task.id}
                      task={task}
                      selected={validSelectedTaskIds.has(
                        task.id,
                      )}
                      onSelectTask={() =>
                        handleSelectTask(task.id)
                      }
                      onToggle={() =>
                        handleToggleTask(task.id)
                      }
                    />
                  ))}
                </ul>
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
        onConfirm={handleDeleteSelected}
      />
    </>
  );
}
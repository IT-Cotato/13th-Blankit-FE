import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import checkButtonGreenIcon from "@/assets/icons/task-combination/check-button-green.svg";

import type { CSSProperties } from "react";
import type { PlaylistTask } from "@/types/taskCombination";

interface PlaylistTaskCardProps {
  task: PlaylistTask;
  selected: boolean;
  draggingDisabled: boolean;
  interactionDisabled: boolean;
  onSelectTask: () => void;
  onToggle: () => void;
}

export function PlaylistTaskCard({
  task,
  selected,
  draggingDisabled,
  interactionDisabled,
  onSelectTask,
  onToggle,
}: PlaylistTaskCardProps) {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: draggingDisabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-playlist-task-id={task.id}
      className={`flex items-center gap-3 rounded-[10px] bg-black-800 px-3 py-3 ${
        isDragging
          ? "scale-[1.02] opacity-60 shadow-lg"
          : ""
      } ${
        draggingDisabled
          ? ""
          : "cursor-grab select-none active:cursor-grabbing"
      }`}
      {...listeners}
    >
      <button
        type="button"
        disabled={interactionDisabled}
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
        disabled={interactionDisabled}
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
        disabled={interactionDisabled}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
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

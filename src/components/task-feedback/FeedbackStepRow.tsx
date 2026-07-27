import { useRef, useState } from "react";

import trashButtonIcon from "@/assets/icons/task-combination/trash-button.svg";
import type { FeedbackStep } from "@/types/taskFeedback";

import { FeedbackProgressSlider } from "./FeedbackProgressSlider";

interface FeedbackStepRowProps {
  step: FeedbackStep;
  onTitleChange: (title: string) => void;
  onProgressChange: (progress: number) => void;
  onDelete: () => void;
}

export function FeedbackStepRow({
  step,
  onTitleChange,
  onProgressChange,
  onDelete,
}: FeedbackStepRowProps) {
  const dragStartXRef = useRef<number | null>(null);
  const [isDeleteRevealed, setIsDeleteRevealed] =
    useState(false);
  const accessibleStepTitle =
    step.title.trim() || "새 단계";

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      (event.target as HTMLElement).closest(
        "input, button",
      )
    ) {
      return;
    }

    dragStartXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const distance = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (distance < -35) {
      setIsDeleteRevealed(true);
    } else if (distance > 25) {
      setIsDeleteRevealed(false);
    }
  };

  return (
    <div className="relative h-[101px] shrink-0 overflow-hidden rounded-[8px]">
      <button
        type="button"
        onClick={onDelete}
        tabIndex={isDeleteRevealed ? 0 : -1}
        aria-hidden={!isDeleteRevealed}
        className="absolute bottom-0 right-0 top-0 flex w-[72px] items-center justify-center px-3"
        aria-label={`${accessibleStepTitle} 단계 삭제`}
      >
        <img
          src={trashButtonIcon}
          alt=""
          className="h-9 w-12"
        />
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartXRef.current = null;
        }}
        className={`relative flex h-[101px] touch-pan-y flex-col gap-1 rounded-[8px] bg-black-750 px-3 py-2 transition-transform ${
          isDeleteRevealed
            ? "-translate-x-[72px]"
            : "translate-x-0"
        }`}
      >
        <input
          value={step.title}
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
          aria-label="단계 이름"
          placeholder="단계 이름"
          className="h-[21px] w-full shrink-0 bg-transparent px-1 text-left text-[14px] font-medium leading-[150%] tracking-[-0.015em] text-black-100 outline-none placeholder:text-black-500"
        />

        <FeedbackProgressSlider
          value={step.progress}
          onChange={onProgressChange}
          label={`${accessibleStepTitle} 진척도`}
          variant="step"
        />
      </div>
    </div>
  );
}

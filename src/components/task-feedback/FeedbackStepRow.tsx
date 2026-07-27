import { useRef, useState } from "react";

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
    <div className="relative overflow-hidden rounded-[8px]">
      <button
        type="button"
        onClick={onDelete}
        className="absolute bottom-0 right-0 top-0 w-16 bg-red-500 text-[12px] font-semibold text-white"
        aria-label={`${step.title} 단계 삭제`}
      >
        삭제
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartXRef.current = null;
        }}
        className={`relative bg-black-700 p-3 transition-transform ${
          isDeleteRevealed
            ? "-translate-x-16"
            : "translate-x-0"
        }`}
      >
        <input
          value={step.title}
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
          aria-label="단계 이름"
          className="mb-2 w-full bg-transparent text-[13px] font-semibold text-black-200 outline-none placeholder:text-black-500"
        />

        <FeedbackProgressSlider
          value={step.progress}
          onChange={onProgressChange}
          label={`${step.title} 진척도`}
        />
      </div>
    </div>
  );
}

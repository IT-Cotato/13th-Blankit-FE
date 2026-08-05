import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import vShapeButtonIcon from "@/assets/icons/task-combination/v-shape-button.svg";

import { PlaylistBottomSheet } from "./PlaylistBottomSheet";

export function EmptyPlaylistPlayer() {
  const navigate = useNavigate();

  const dragStartYRef = useRef<number | null>(null);

  const [isBottomSheetOpen, setIsBottomSheetOpen] =
    useState(false);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    dragStartYRef.current = event.clientY;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartYRef.current === null) {
      return;
    }

    const distance =
      event.clientY - dragStartYRef.current;

    dragStartYRef.current = null;

    if (!isBottomSheetOpen && distance > 60) {
      navigate(-1);
    }
  };

  const handlePointerCancel = () => {
    dragStartYRef.current = null;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="flex min-h-[calc(100dvh-90px)] touch-pan-y flex-col px-5"
    >
      <header className="flex h-[50px] items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="플레이 화면 닫기"
          className="flex h-10 w-10 items-center justify-start"
        >
          <img
            src={vShapeButtonIcon}
            alt=""
            className="h-[7px] w-3"
          />
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center pb-[100px] text-center">
        <div>
          <h1 className="text-[18px] font-semibold text-black-200">
            재생할 과업이 없어요
          </h1>

          <p className="mt-3 text-[13px] font-medium leading-[150%] text-black-600">
            화면을 아래로 내리면
            <br />
            이전 화면으로 돌아갑니다.
          </p>
        </div>
      </div>

      <PlaylistBottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
      />
    </div>
  );
}
import { useState } from "react";

import iButtonIcon from "@/assets/icons/task-combination/i-button.svg";

import { AnchoredTooltip } from "./AnchoredTooltip";

export function RecommendedTimeGuide() {
  const [isTooltipOpen, setIsTooltipOpen] =
    useState(false);

  return (
    <div className="absolute bottom-[calc(100%+2px)] left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap">
      <span className="text-[14px] font-medium text-black-600">
        권장시간
      </span>

      <div className="relative h-[14px] w-[14px]">
        <button
          type="button"
          onClick={() =>
            setIsTooltipOpen((open) => !open)
          }
          aria-label="권장시간 계산 안내"
          aria-expanded={isTooltipOpen}
          className="flex h-[14px] w-[14px] items-center justify-center"
        >
          <img
            src={iButtonIcon}
            alt=""
            className="h-[14px] w-[14px]"
          />
        </button>

        {isTooltipOpen && (
          <AnchoredTooltip
            variant="recommendedTime"
            onDismiss={() => setIsTooltipOpen(false)}
            dialogLabel="권장시간 계산 안내"
            closeLabel="권장시간 안내 닫기"
          >
            과업의 예상 시간과 마감일을 반영해
            <br />
            오늘의 권장 시간을 계산했어요.
          </AnchoredTooltip>
        )}
      </div>
    </div>
  );
}
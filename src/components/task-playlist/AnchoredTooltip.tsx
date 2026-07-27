import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import tooltipXButtonIcon from "@/assets/icons/task-combination/tool-tip-x-button.svg";

interface AnchoredTooltipProps {
  children: ReactNode;
  onDismiss: () => void;
  closeLabel: string;
  widthClassName?: string;
  heightClassName?: string;
  positionClassName?: string;
  arrowPositionClassName?: string;
}

export function AnchoredTooltip({
  children,
  onDismiss,
  closeLabel,
  widthClassName = "w-[175px]",
  heightClassName = "h-[60px]",
  positionClassName = "bottom-[calc(100%+20px)] right-0",
  arrowPositionClassName = "top-[56px] right-[15px]",
}: AnchoredTooltipProps) {
  return (
    <>
      {createPortal(
        <div
          role="presentation"
          onPointerDown={onDismiss}
          className="fixed inset-0 z-[65]"
        />,
        document.body,
      )}

      <div
        role="tooltip"
        onPointerDown={(event) => event.stopPropagation()}
        className={`absolute z-[70] rounded-[8px] bg-black-700 px-4 py-3 text-[12px] font-medium leading-[150%] tracking-[-0.015em] text-black-400 ${widthClassName} ${heightClassName} ${positionClassName}`}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="whitespace-nowrap">{children}</div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label={closeLabel}
            className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center"
          >
            <img
              src={tooltipXButtonIcon}
              alt=""
              className="h-4 w-4"
            />
          </button>
        </div>

        <span
          aria-hidden="true"
          className={`absolute h-[13px] w-5 bg-black-700 [clip-path:polygon(0_0,100%_0,50%_100%)] ${arrowPositionClassName}`}
        />
      </div>
    </>
  );
}

import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import tooltipXButtonIcon from "@/assets/icons/task-combination/tool-tip-x-button.svg";

interface AnchoredTooltipProps {
  children: ReactNode;
  onDismiss: () => void;
  dialogLabel: string;
  closeLabel: string;
  variant?: "completion" | "recommendedTime";
}

const TOOLTIP_VARIANT_CLASS_NAMES = {
  completion: {
    container:
      "h-[60px] w-[175px] bottom-[calc(100%+20px)] right-0",
    arrow: "top-[56px] right-[15px]",
  },
  recommendedTime: {
    container:
      "h-[60px] w-[215px] bottom-[calc(100%+14px)] left-1/2 -translate-x-[60%]",
    arrow:
      "top-[56px] left-[60%] -translate-x-1/2",
  },
} as const satisfies Record<
  NonNullable<AnchoredTooltipProps["variant"]>,
  { container: string; arrow: string }
>;

export function AnchoredTooltip({
  children,
  onDismiss,
  dialogLabel,
  closeLabel,
  variant = "completion",
}: AnchoredTooltipProps) {
  const variantClassNames =
    TOOLTIP_VARIANT_CLASS_NAMES[variant];

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
        role="dialog"
        aria-label={dialogLabel}
        onPointerDown={(event) => event.stopPropagation()}
        className={`absolute z-[70] rounded-[8px] bg-black-700 px-4 py-3 text-[12px] font-medium leading-[150%] tracking-[-0.015em] text-black-400 ${variantClassNames.container}`}
      >
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

        <span
          aria-hidden="true"
          className={`absolute h-[13px] w-5 bg-black-700 [clip-path:polygon(0_0,100%_0,50%_100%)] ${variantClassNames.arrow}`}
        />
      </div>
    </>
  );
}

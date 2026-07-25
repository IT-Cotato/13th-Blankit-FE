import { useEffect, useRef } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );

      if (!focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
      previouslyFocusedElement?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black-900/80 px-5">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        className="w-full max-w-[360px] rounded-[12px] bg-black-850 p-5"
      >
        <h2
          id="confirmation-dialog-title"
          className="py-5 text-center text-[15px] font-medium leading-[150%] text-black-200"
        >
          {title}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="h-12 rounded-[6px] bg-black-750 text-[14px] font-semibold text-black-300"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-[6px] bg-green-500 text-[14px] font-semibold text-black-900"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

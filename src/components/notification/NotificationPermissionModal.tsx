import { useEffect, useRef } from "react";

interface NotificationPermissionModalProps {
  open: boolean;
  submitting?: boolean;
  title?: string;
  description?: string;
  onAllow: () => void;
  onClose: () => void;
}

export function NotificationPermissionModal({
  open,
  submitting = false,
  title = "마감일을 놓치지 않도록 미리 알려드릴게요",
  description = "알림을 허용하면 마감일 전에 미리 알림을 보내드려 중요한 과업을 잊지 않을 수 있도록 도와드릴게요.",
  onAllow,
  onClose,
}: NotificationPermissionModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const allowButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    allowButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();

        if (!submitting) {
          onClose();
        }

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
        focusableElements[
          focusableElements.length - 1
        ];

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
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose, open, submitting]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-permission-title"
        aria-describedby="notification-permission-description"
        aria-busy={submitting}
        className="flex w-[320px] max-w-full flex-col items-center gap-2.5 rounded-[12px] bg-black-850 p-3 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)]"
      >
        <div className="flex self-stretch flex-col items-center justify-center gap-2 px-2 py-4">
          <h2
            id="notification-permission-title"
            className="self-stretch text-center text-[16px] font-medium leading-[150%] tracking-[-0.24px] text-black-100"
          >
            {title}
          </h2>

          <p
            id="notification-permission-description"
            className="self-stretch text-center text-[14px] font-normal leading-[150%] tracking-[-0.21px] text-black-650"
          >
            {description}
          </p>
        </div>

        <button
          ref={allowButtonRef}
          type="button"
          disabled={submitting}
          onClick={onAllow}
          className="flex h-[42px] self-stretch flex-col items-center justify-center gap-2.5 rounded-[8px] bg-black-800 px-[42px] text-center text-[14px] font-medium leading-[150%] tracking-[-0.21px] text-black-600 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          알림 허용하기
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="flex h-9 self-stretch flex-col items-center justify-center gap-2.5 rounded-[8px] px-[42px] text-center text-[14px] font-medium leading-[150%] tracking-[-0.21px] text-black-600 outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          다음에 할게요
        </button>
      </section>
    </div>
  );
}

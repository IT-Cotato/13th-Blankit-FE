import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  open,
  title,
  cancelLabel = "취소",
  confirmLabel = "확인",
  submitting = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onCancel();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onCancel, open, submitting]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-busy={submitting}
        className="flex w-[320px] max-w-full flex-col gap-2.5 rounded-[12px] bg-black-850 p-3 shadow-[0_10px_60px_0_#00000099]"
      >
        <h2
          id="confirm-modal-title"
          className="flex h-[72px] items-center justify-center px-2 py-6 text-center text-[16px] font-medium text-black-100"
        >
          {title}
        </h2>

        <div className="flex h-[41px] gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={submitting}
            onClick={onCancel}
            className="h-[41px] min-w-0 flex-1 rounded-[6px] bg-black-800 px-5 py-2.5 text-[14px] font-medium text-black-600 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className="h-[41px] min-w-0 flex-1 rounded-[6px] bg-green-500 px-5 py-2.5 text-[14px] font-semibold text-black-900 disabled:opacity-50"
          >
            {submitting ? "처리 중" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

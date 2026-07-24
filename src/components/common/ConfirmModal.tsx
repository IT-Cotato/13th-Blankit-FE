interface ConfirmModalProps {
  open: boolean;
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  open,
  title,
  cancelLabel = "취소",
  confirmLabel = "삭제",
  isSubmitting = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/60 px-5
      "
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="
          flex w-[320px] max-w-full flex-col gap-2.5
          rounded-[12px] bg-black-850 p-3
          shadow-[0px_10px_60px_0px_#00000099]
        "
      >
        <h2
          id="confirm-modal-title"
          className="
            flex h-[72px] items-center justify-center
            px-2 py-6 text-center
            text-[14px] font-medium text-black-100
          "
        >
          {title}
        </h2>

        <div className="flex h-[41px] gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="
              h-[41px] min-w-0 flex-1
              rounded-[6px] bg-black-800
              px-5 py-2.5
              text-[14px] font-medium text-black-600
              disabled:opacity-50
            "
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="
              h-[41px] min-w-0 flex-1
              rounded-[6px] bg-green-500
              px-5 py-2.5
              text-[14px] font-semibold text-black-900
              disabled:opacity-50
            "
          >
            {isSubmitting ? "삭제 중" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
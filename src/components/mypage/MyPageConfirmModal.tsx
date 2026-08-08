type MyPageConfirmModalProps = {
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
  labelledBy: string;
};

export function MyPageConfirmModal({
  title,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
  labelledBy,
}: MyPageConfirmModalProps) {
  const hasCancelButton = Boolean(cancelLabel && onCancel);

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 px-5"
      onMouseDown={(event) => {
        if (hasCancelButton && event.target === event.currentTarget) onCancel?.();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`flex h-[147px] w-[320px] max-w-full flex-col items-center justify-center gap-2.5 rounded-xl bg-black-850 py-2.5 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)] ${hasCancelButton ? "px-3" : "px-5"}`}
      >
        <p
          id={labelledBy}
          className="flex min-h-0 w-full flex-1 flex-col items-center justify-center self-stretch px-2 py-6 text-center text-base font-medium leading-[150%] tracking-[-0.24px] text-black-100"
        >
          {title}
        </p>

        <div className="flex h-[41px] w-full shrink-0 gap-2.5">
          {hasCancelButton && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-[41px] w-[143px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-black-800 px-5 py-2.5 text-center text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-600"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex h-[41px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-green-500 px-5 py-2.5 text-center text-sm font-semibold leading-[150%] tracking-[-0.21px] text-black-900 ${hasCancelButton ? "w-[143px]" : "w-full"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

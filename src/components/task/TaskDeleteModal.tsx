interface TaskDeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TaskDeleteModal({
  open,
  onCancel,
  onConfirm,
}: TaskDeleteModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-5">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-delete-title"
        className="w-full max-w-[338px] rounded-[12px] bg-black-850 p-3 pt-10 shadow-xl"
      >
        <h2
          id="task-delete-title"
          className="text-center text-[16px] font-semibold leading-[150%] text-black-100"
        >
          과업을 진짜 삭제하시겠습니까?
        </h2>

        <div className="mt-9 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-[6px] bg-black-800 text-[14px] font-semibold text-black-600 active:bg-black-750"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-[6px] bg-green-500 text-[14px] font-semibold text-black-900 active:bg-green-600"
          >
            확인
          </button>
        </div>
      </section>
    </div>
  );
}

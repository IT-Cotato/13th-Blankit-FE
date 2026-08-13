interface ExpiredTaskToastProps {
  taskTitle: string;
  onExtendDeadline: () => void;
}

export function ExpiredTaskToast({
  taskTitle,
  onExtendDeadline,
}: ExpiredTaskToastProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[130] bg-black opacity-70"
      />

      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-[130px] left-1/2 z-[131] flex w-[calc(100%-40px)] max-w-[360px] -translate-x-1/2 items-center justify-between gap-3 rounded-[6px] border border-black-750 bg-black-800 px-4 py-3 shadow-lg"
      >
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-black-200">
          {taskTitle} 과업이 곧 삭제됩니다.
        </p>

        <button
          type="button"
          onClick={onExtendDeadline}
          className="shrink-0 rounded-[4px] bg-black-700 px-3 py-2 text-[12px] font-medium text-black-300 active:bg-black-650"
        >
          마감일 연장하기
        </button>
      </div>
    </>
  );
}

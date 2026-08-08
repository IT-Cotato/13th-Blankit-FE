type TimeTableResetModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function TimeTableResetModal({
  onCancel,
  onConfirm,
}: TimeTableResetModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="timetable-reset-modal-title"
        className="flex h-[171px] w-[320px] max-w-full flex-col gap-2.5 rounded-xl bg-black-850 p-3 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)]"
      >
        <p
          id="timetable-reset-modal-title"
          className="flex h-24 w-full shrink-0 flex-col items-center justify-center self-stretch px-2 py-6 text-center text-base font-medium leading-[150%] tracking-[-0.24px] text-black-100"
        >
          시간표를 초기화하시겠습니까?
          <br />
          모든 데이터가 삭제됩니다
        </p>

        <div className="flex h-[41px] w-full shrink-0 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[41px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-black-800 px-5 py-2.5 text-center text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-600"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[41px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-green-500 px-5 py-2.5 text-center text-sm font-semibold leading-[150%] tracking-[-0.21px] text-black-900"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

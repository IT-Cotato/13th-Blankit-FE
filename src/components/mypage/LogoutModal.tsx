type LogoutModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function LogoutModal({ onCancel, onConfirm }: LogoutModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="flex h-[147px] w-[320px] max-w-full flex-col items-center gap-2.5 rounded-xl bg-black-850 p-3 shadow-[0_10px_60px_0_rgba(0,0,0,0.60)]"
      >
        <p
          id="logout-modal-title"
          className="flex w-full flex-1 items-center justify-center text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100"
        >
          로그아웃 하시겠습니까?
        </p>

        <div className="flex h-[41px] w-full shrink-0 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[41px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-black-800 px-5 py-2.5 text-center text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[41px] min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 rounded-md bg-green-500 px-5 py-2.5 text-center text-sm font-semibold leading-[21px] tracking-[-0.21px] text-black-900"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

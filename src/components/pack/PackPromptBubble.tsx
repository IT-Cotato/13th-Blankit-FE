interface PackPromptBubbleProps {
  minutes: number;
  onClose: () => void;
}

export function PackPromptBubble({
  minutes,
  onClose,
}: PackPromptBubbleProps) {
  return (
    <div className="relative inline-flex">
      <svg
        aria-hidden="true"
        viewBox="0 0 13 20"
        fill="none"
        className="absolute right-[-6px] top-1/2 z-0 h-5 w-[13px] -translate-y-1/2"
      >
        <path
          d="M13 10L1.03312e-06 -1.3391e-06L1.90735e-06 20L13 10Z"
          fill="#505357"
        />
      </svg>

      <div className="relative z-10 inline-flex flex-col items-end justify-center gap-[10px] rounded-[8px] bg-black-700 px-3 py-2">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap text-right font-sans text-[12px] font-medium not-italic leading-[150%] tracking-[-0.18px] text-black-400">
            {minutes}분을 그냥 보내긴 아깝잖아요!
          </p>
          <button
            type="button"
            aria-label="안내 말풍선 닫기"
            onClick={onClose}
            className="flex h-[10px] w-[10px] shrink-0 items-center justify-center"
          >
            <img
              src="/mypage/X.svg"
              alt=""
              aria-hidden="true"
              className="h-[10px] w-[10px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

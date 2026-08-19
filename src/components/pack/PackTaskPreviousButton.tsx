interface PackTaskPreviousButtonProps {
  disabled?: boolean;
  selected?: boolean;
  onClick: () => void;
}

export function PackTaskPreviousButton({
  disabled = false,
  selected = false,
  onClick,
}: PackTaskPreviousButtonProps) {
  return (
    <button
      type="button"
      aria-label="이전 추천 과업 보기"
      disabled={disabled}
      onClick={onClick}
      className={`relative flex h-6 w-[22px] shrink-0 items-center justify-center gap-[10px] px-[3px] py-0.5 transition-colors disabled:cursor-default ${
        selected ? "bg-black-650" : "bg-transparent"
      }`}
    >
      <img
        src="/mypage/left.svg"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-6 w-[22px] transition-[filter] ${
          selected ? "brightness-[4.4]" : ""
        }`}
      />
    </button>
  );
}

interface PackTaskNextButtonProps {
  disabled?: boolean;
  selected?: boolean;
  onClick: () => void;
}

export function PackTaskNextButton({
  disabled = false,
  selected = false,
  onClick,
}: PackTaskNextButtonProps) {
  return (
    <button
      type="button"
      aria-label="다음 추천 과업 보기"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-6 w-[22px] shrink-0 items-center justify-center gap-[10px] px-[3px] py-0.5 transition-colors disabled:cursor-default ${
        selected ? "bg-black-650" : "bg-transparent"
      }`}
    >
      <img
        src="/mypage/right.svg"
        alt=""
        aria-hidden="true"
        className={`h-3 w-[7px] transition-[filter] ${
          selected ? "brightness-[4.4]" : ""
        }`}
      />
    </button>
  );
}

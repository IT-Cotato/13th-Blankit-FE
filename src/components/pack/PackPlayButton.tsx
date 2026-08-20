import playIcon from "@/assets/icons/task-combination/play.svg";

interface PackPlayButtonProps {
  onClick?: () => void;
}

export function PackPlayButton({ onClick }: PackPlayButtonProps) {
  return (
    <button
      type="button"
      aria-label="과업 시작"
      onClick={onClick}
      className="mt-3 flex h-12 w-12 shrink-0 items-center justify-center gap-[11.429px] rounded-[24px] bg-black-800"
    >
      <img
        src={playIcon}
        alt=""
        aria-hidden="true"
        className="h-[18.949px] w-[12.16px] shrink-0 translate-x-[1.92px]"
      />
    </button>
  );
}

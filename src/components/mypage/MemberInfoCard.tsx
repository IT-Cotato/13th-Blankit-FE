type MemberInfoCardProps = {
  name?: string;
  description?: string;
  onClick?: () => void;
};

export function MemberInfoCard({
  name = "이름",
  description = "네이버로 로그인",
  onClick,
}: MemberInfoCardProps) {
  return (
    <button
      type="button"
      aria-label={`${name} 회원 정보 보기`}
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl bg-black-800 px-4 py-3 text-left transition-colors hover:bg-black-750 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
    >
      <span className="flex min-w-0 items-center gap-4">
        <img
          src="/mypage/profile.svg"
          alt=""
          className="h-12 w-12 shrink-0"
          aria-hidden="true"
        />

        <span className="min-w-0">
          <span className="block truncate text-base font-semibold leading-6 text-black-100">
            {name}
          </span>
          <span className="block truncate text-xs font-medium leading-[18px] tracking-[-0.18px] text-black-600">
            {description}
          </span>
        </span>
      </span>

      <img
        src="/mypage/chevron-right.svg"
        alt=""
        className="ml-3 h-6 w-6 shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}

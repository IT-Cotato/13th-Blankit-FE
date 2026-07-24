import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

type CompletedTaskTopBarProps = {
  onBack: () => void;
};

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CompletedTaskTopBar({ onBack }: CompletedTaskTopBarProps) {
  return (
    <TopBarShell>
      <div className="relative flex h-full w-full items-center justify-center">
        <button
          type="button"
          aria-label="마이페이지로 돌아가기"
          onClick={onBack}
          className="absolute left-0 grid h-9 w-9 place-items-center text-black-650 transition-colors hover:text-black-300 focus-visible:outline-2 focus-visible:outline-green-500"
        >
          <BackIcon />
        </button>

        <h1 className="text-base font-semibold leading-6 tracking-[-0.24px] text-black-100">
          내 완료한 과업 보기
        </h1>
      </div>
    </TopBarShell>
  );
}

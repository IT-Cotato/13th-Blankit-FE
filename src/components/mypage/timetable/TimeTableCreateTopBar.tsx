import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

type TimeTableCreateTopBarProps = {
  onCancel: () => void;
  onComplete: () => void;
  completeDisabled?: boolean;
};

export function TimeTableCreateTopBar({
  onCancel,
  onComplete,
  completeDisabled = true,
}: TimeTableCreateTopBarProps) {
  return (
    <TopBarShell>
      <div className="flex h-full w-full items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-center text-lg font-semibold leading-[150%] tracking-[-0.27px] text-black-100 outline-none focus-visible:outline-2 focus-visible:outline-green-500"
        >
          취소
        </button>
        <button
          type="button"
          disabled={completeDisabled}
          onClick={onComplete}
          className="text-center text-lg font-semibold leading-[150%] tracking-[-0.27px] text-black-600 outline-none focus-visible:outline-2 focus-visible:outline-green-500 disabled:cursor-default"
        >
          완료
        </button>
      </div>
    </TopBarShell>
  );
}

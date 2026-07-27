export type CompletedTaskCardProps = {
  completedAt: string;
  title: string;
  duration: string;
};

function CompletedCheckIcon() {
  return (
    <span className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center gap-2.5 rounded-[100px] bg-black-800 p-2.5">
      <img
        src="/mypage/complete.svg"
        alt=""
        className="h-[11px] w-[11px] shrink-0 object-contain"
        aria-hidden="true"
      />
    </span>
  );
}

export function CompletedTaskCard({
  completedAt,
  title,
  duration,
}: CompletedTaskCardProps) {
  return (
    <article className="flex h-16 w-full self-stretch flex-col items-start gap-3 rounded-xl bg-black-850 p-3">
      <div className="flex h-10 w-full items-center gap-3">
        <CompletedCheckIcon />

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-normal leading-[18px] tracking-[-0.18px] text-black-650">
            {completedAt}
          </p>
          <h2 className="truncate text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-100">
            {title}
          </h2>
        </div>

        <span className="shrink-0 text-xs font-medium leading-[18px] tracking-[-0.18px] text-black-600">
          {duration}
        </span>
      </div>
    </article>
  );
}

import { TopBarIconButton } from "@/components/layout/top-bar/TopBarIconButton";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.62l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.2 7.2 0 0 0-1.62-.94L14.4 2.8a.48.48 0 0 0-.48-.4h-3.84a.48.48 0 0 0-.48.4l-.36 2.54c-.58.24-1.12.56-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.72 8.86a.49.49 0 0 0 .12.62l2.03 1.58c-.05.31-.08.64-.08.94s.03.63.08.94l-2.03 1.58a.49.49 0 0 0-.12.62l1.92 3.32c.12.22.38.31.59.22l2.39-.96c.5.39 1.04.7 1.62.94l.36 2.54c.04.23.24.4.48.4h3.84c.24 0 .44-.17.48-.4l.36-2.54a7.2 7.2 0 0 0 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.62l-2.02-1.58ZM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" />
    </svg>
  );
}

export function MyPageTopBar() {
  return (
    <TopBarShell>
      <div className="flex h-full w-full items-center justify-between">
        <h1 className="text-[32px] font-bold leading-[150%] tracking-[-0.64px] text-black-100 [font-feature-settings:'liga'_off,'clig'_off]">
          My
        </h1>

        <TopBarIconButton aria-label="설정">
          <SettingsIcon />
        </TopBarIconButton>
      </div>
    </TopBarShell>
  );
}

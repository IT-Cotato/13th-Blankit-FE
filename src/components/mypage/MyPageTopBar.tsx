import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

export function MyPageTopBar() {
  return (
    <TopBarShell>
      <div className="flex h-full w-full items-center">
        <h1 className="text-[32px] font-bold leading-[150%] tracking-[-0.64px] text-black-100 [font-feature-settings:'liga'_off,'clig'_off]">
          My
        </h1>
      </div>
    </TopBarShell>
  );
}

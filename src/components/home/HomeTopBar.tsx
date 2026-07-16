import { Link } from "react-router-dom";

import plusIcon from "@/assets/icons/plus/plus-black.svg";
import searchIcon from "@/assets/icons/search/search-black.svg";

import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

export function HomeTopBar() {
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(new Date());

  return (
    <TopBarShell>
      <div className="flex w-full items-center justify-between ">
        <span className="text-[32px] font-bold leading-[150%] tracking-[-0.02em] text-black-100">
            {todayLabel}
        </span>

        <div className="flex items-center gap-3">
          <button type="button" aria-label="과업 추가">
            <img src={plusIcon} alt="" />
          </button>

          <Link to="/home/search" aria-label="과업 검색">
            <img src={searchIcon} alt="" />
          </Link>
        </div>
      </div>
    </TopBarShell>
  );
}
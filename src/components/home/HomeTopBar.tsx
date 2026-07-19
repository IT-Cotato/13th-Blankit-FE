import { useState } from "react";
import { Link } from "react-router-dom";

import plusIcon from "@/assets/icons/plus/plus-black.svg";
import searchIcon from "@/assets/icons/search/search-black.svg";
import { TopBarShell } from "@/components/layout/top-bar/TopBarShell";

type HomeTopBarProps = {
  showRegistrationHint?: boolean;
};

export function HomeTopBar({
  showRegistrationHint = false,
}: HomeTopBarProps) {
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(new Date());

  const [isHintVisible, setIsHintVisible] = useState(true);

  return (
    <TopBarShell>
      <div className="flex w-full items-center justify-between">
        <span className="text-[32px] font-bold leading-[150%] tracking-[-0.02em] text-black-100">
          {todayLabel}
        </span>

        <div className="relative flex items-center gap-3">
          <button type="button" aria-label="과업 추가">
            <img src={plusIcon} alt="" />
          </button>

          {showRegistrationHint && isHintVisible && (
            <div
              role="status"
              className="absolute right-8 top-[60px] z-10 flex h-[49px] w-max items-center gap-2 rounded-[8px] bg-black-700 px-4"
            >
              <div className="absolute -top-2 right-[26px] h-0 w-0 border-x-[8px] border-b-[8px] border-x-transparent border-b-black-700" />

              <span className="text-[12px] font-medium text-black-400">
                과업을 등록해보세요
              </span>

              <button
                type="button"
                aria-label="안내 메시지 닫기"
                onClick={() => {
                  setIsHintVisible(false);
                }}
                className="flex h-5 w-5 items-center justify-center text-[23px] font-light leading-none text-black-400"
              >
                ×
              </button>
            </div>
          )}

          <Link to="/home/search" aria-label="과업 검색">
            <img src={searchIcon} alt="" />
          </Link>
        </div>
      </div>
    </TopBarShell>
  );
}
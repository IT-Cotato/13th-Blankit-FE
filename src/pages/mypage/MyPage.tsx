import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoutModal } from "@/components/mypage/LogoutModal";
import { MyPageTopBar } from "@/components/mypage/MyPageTopBar";
import { MemberInfoCard } from "@/components/mypage/MemberInfoCard";

const menuItems = [
  {
    label: "내 완료한 과업 보기",
    icon: "/mypage/task.svg",
    iconClassName: "h-5 w-5 shrink-0",
    path: "/mypage/completed-tasks",
  },
  {
    label: "내 시간표 설정",
    icon: "/mypage/timetable.svg",
    iconClassName: "h-[19.998px] w-5 shrink-0",
  },
  {
    label: "내 우선순위 설정",
    icon: "/mypage/priority.svg",
    iconClassName: "h-5 w-[13.336px] shrink-0",
  },
  {
    label: "내 알림설정",
    icon: "/mypage/notification.svg",
    iconClassName: "h-5 w-5 shrink-0",
  },
];

export function MyPage() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-black-900 pb-28 text-black-100">
      <MyPageTopBar />
      <div className="px-5 pt-5">
      <div className="mb-5">
        <MemberInfoCard />
      </div>

      <section aria-label="마이페이지 메뉴" className="mb-5 overflow-hidden rounded-xl bg-black-850">
        {menuItems.map(({ label, icon, iconClassName, path }, index) => (
          <button key={label} type="button" onClick={() => path && navigate(path)} className={`relative flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-green-500 ${index !== menuItems.length - 1 ? "after:absolute after:bottom-0 after:left-[17px] after:right-[17px] after:h-px after:bg-black-800 after:content-['']" : ""}`}>
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-black-800 text-black-600">
                <img
                  src={icon}
                  alt=""
                  className={iconClassName ?? "h-8 w-8 shrink-0 object-contain"}
                  aria-hidden="true"
                />
              </span>
              <span className="truncate text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-400">
                {label}
              </span>
            </span>
            <img
              src="/mypage/chevron-right.svg"
              alt=""
              className="ml-3 h-6 w-6 shrink-0"
              aria-hidden="true"
            />
          </button>
        ))}
      </section>

      <button
        type="button"
        onClick={() => setIsLogoutModalOpen(true)}
        className="flex h-12 w-full flex-col items-center justify-center gap-2.5 rounded-lg bg-black-800 text-sm font-medium leading-[21px] tracking-[-0.21px] text-black-600 transition-colors hover:text-black-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
      >
        로그아웃
      </button>
      </div>

      {isLogoutModalOpen && (
        <LogoutModal
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={() => setIsLogoutModalOpen(false)}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MyPageDetailTopBar } from "@/components/mypage/MyPageDetailTopBar";

export function EverytimeTimeTableLink() {
  const navigate = useNavigate();
  const [sharedUrl, setSharedUrl] = useState("");
  const hasSharedUrl = sharedUrl.trim().length > 0;

  return (
    <div className="flex h-dvh flex-col bg-black-900 text-black-100">
      <MyPageDetailTopBar
        title="에브리타임 시간표 연동"
        onBack={() => navigate("/mypage/timetable/settings")}
      />

      <main className="flex min-h-0 flex-1 flex-col px-5 pt-5">
        <label htmlFor="everytime-timetable-search" className="sr-only">
          에브리타임 시간표 검색
        </label>
        <div className="flex h-[42px] w-full items-center justify-between gap-2.5 self-stretch rounded-md bg-black-800 px-3 py-1">
          <input
            id="everytime-timetable-search"
            type="search"
            value={sharedUrl}
            onChange={(event) => setSharedUrl(event.target.value)}
            placeholder="검색어 입력"
            className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent text-left text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-100 outline-none placeholder:text-black-600 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>

        <p className="mt-3 text-left text-xs font-medium leading-[150%] tracking-[-0.18px] text-black-650">
          URL 공유로 복사한 시간표를 붙여넣기 해주세요.
        </p>
        <p className="mt-1 text-left text-xs font-medium leading-[150%] tracking-[-0.18px] text-black-700">
          시간표의 공개 범위를 잠시 동안 &apos;전체 공개&apos;로 바꿔주세요.
          <br />
          (설정 아이콘 → 공개 범위 변경 → 전체 공개)
        </p>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <div
            className="pointer-events-none flex max-h-full max-w-full flex-col items-center"
            style={{
              height: "min(428px, 100%)",
              aspectRatio: "333 / 428",
            }}
          >
            <img
              src="/mypage/everytime1.svg"
              alt="에브리타임 시간표 설정 아이콘 선택 안내"
              className="block w-full shrink-0"
              style={{ height: `${(138 / 428) * 100}%` }}
            />
            <img
              src="/mypage/everytime2.svg"
              alt="에브리타임 시간표 URL 복사 안내"
              className="block w-full shrink-0"
              style={{ height: `${(290 / 428) * 100}%` }}
            />
          </div>
        </div>
      </main>

      <footer className="flex h-[90px] w-full shrink-0 items-center px-5">
        <button
          type="button"
          disabled={!hasSharedUrl}
          className={`flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-2.5 rounded-lg px-[50px] text-center text-sm leading-[150%] tracking-[-0.21px] outline-none focus-visible:outline-2 focus-visible:outline-green-500 ${
            hasSharedUrl
              ? "bg-green-500 font-semibold text-black-900"
              : "bg-black-800 font-medium text-black-600"
          }`}
        >
          완료
        </button>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TimeTableResetModal } from "@/components/mypage/timetable/TimeTableResetModal";

type TimeTableDataSettingProps = {
  onReset: () => void;
};

export function TimeTableDataSetting({ onReset }: TimeTableDataSettingProps) {
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <section className="flex w-full flex-col items-start">
      <h2 className="w-full flex-1 text-left text-base font-semibold leading-[150%] tracking-[-0.24px] text-black-100">
        데이터
      </h2>

      <button
        type="button"
        aria-label="시간표 초기화"
        onClick={() => setIsResetModalOpen(true)}
        className="mt-2 flex w-full items-center gap-3 rounded-xl bg-black-850 p-3 text-left shadow-[0_10px_60px_0_rgba(0,0,0,0.60)] outline-none focus-visible:outline-2 focus-visible:outline-green-500"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black-800 [aspect-ratio:1/1]"
        >
          <img
            src="/mypage/reset.svg"
            alt=""
            className="h-5 w-5 shrink-0"
          />
        </span>

        <span className="min-w-0">
          <span className="block text-left text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-100">
            초기화
          </span>
          <span className="block text-left text-xs font-medium leading-[150%] tracking-[-0.18px] text-black-700">
            시간표를 처음부터 다시 만듭니다
          </span>
        </span>
      </button>

      <h2 className="mt-6 w-full flex-1 text-left text-base font-semibold leading-[150%] tracking-[-0.24px] text-black-100">
        시간표 연동
      </h2>

      <button
        type="button"
        onClick={() => navigate("/mypage/timetable/everytime-link")}
        className="mt-2 flex h-16 w-full items-center gap-3 rounded-xl bg-black-850 p-3 text-left shadow-[0_10px_60px_0_rgba(0,0,0,0.60)] outline-none focus-visible:outline-2 focus-visible:outline-green-500"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black-800 [aspect-ratio:1/1]"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center gap-2.5 py-0.5">
            <img
              src="/mypage/timetable.svg"
              alt=""
              className="h-5 w-5 shrink-0"
            />
          </span>
        </span>
        <span className="min-w-0 text-center text-sm font-medium leading-[150%] tracking-[-0.21px] text-black-100">
          에브리타임 시간표 연동
        </span>
      </button>
      </section>

      {isResetModalOpen && (
        <TimeTableResetModal
          onCancel={() => setIsResetModalOpen(false)}
          onConfirm={onReset}
        />
      )}
    </>
  );
}
